import { ValueType } from '../model/ds';
import { Browser, Page } from '../webcrawler-model/page';
import { API } from '../helper/api-helper';
import { getRandomId } from '../helper/random-helper';
import { Promised } from '../helper/type-helper';

export interface WebcrawlerRequest {
  url: string;
  headers: Record<string, string>;
}

export interface WebcrawlerResponse {
  url: string;
  status: number;
  headers: Record<string, string>;
}

export interface WebcrawlerRunOptions {
  onRequest?(request: WebcrawlerRequest): any;

  onResponse?(response: WebcrawlerResponse): any;
}

interface WebcrawlerEvents {
  request: WebcrawlerRequest;
  response: WebcrawlerResponse;
}

type Handler<key extends keyof WebcrawlerEvents> = (event: WebcrawlerEvents[key]) => any;

export namespace Webcrawler {
  let proxySessionId: string | undefined;
  let ws: WebSocket;
  let eventHandlers: { [key in keyof WebcrawlerEvents]?: ( Handler<key> )[] };

  /**
   * Start crawler, i.e. session. There can be only one crawler running
   * by the client at the time, so previous session will be terminated,
   * if any
   */
  export async function start(): Promise<void> {
    await stop();
    const proxySessionData = await API.get('/proxy/session');
    proxySessionId = proxySessionData.session;
    return new Promise((resolve) => {
      ws = new WebSocket(proxySessionData.endpoint);
      ws.addEventListener('open', () => {
        resolve();
      });
      ws.addEventListener('message', __handleMessage);
    });
  }

  /**
   * Stop crawler, i.e. current proxy session
   */
  export async function stop(): Promise<void> {
    if (proxySessionId) {
      await API.del(`/proxy/${proxySessionId}`);
      proxySessionId = undefined;
      ws.close();
    }
  }

  /**
   * Run a web crawler, using current session ID and websocket connection.
   * There are two approaches of running a web crawler: executing
   * a crawler locally in the browser, and sending each command to the
   * remote browser; and sending an entire script to be executed on the
   * remote (proxy) browser.
   * Each has pros and cons.
   *
   * The first one is slower and require stable connection. However,
   * it allows potential in-browser debug.
   *
   * The latter is faster and allows, for example scheduling of
   * script execution.
   *
   * Currently we support the latter approach only.
   *
   * @param script {string}A script to run. Currently it can be a standalone
   * script with no dependencies, passed as a string, only.
   * Later we might extend it to allow crawler consisted of multiple
   * files, with dependencies,etc.
   * Script must be a function declaration (no calls, no export), with
   * a single argument of type {@link Page}, which returns Promise of 2D array
   * of data.
   *
   * @param options {WebcrawlerRunOptions} optional options.
   * @returns data returned by the script
   */
  export function run(script: string, options?: WebcrawlerRunOptions): Promise<ValueType[][]> {
    if (options?.onRequest) {
      on('request', options.onRequest);
    }
    if (options?.onResponse) {
      on('response', options.onResponse);
    }
    return __call<any, ValueType[][]>({ script }).finally(() => {
      if (options?.onRequest) {
        off('request', options.onRequest);
      }
      if (options?.onResponse) {
        off('response', options.onResponse);
      }
    });
  }

  /**
   * Call a single method of a remote `Page` in the current session.
   * @param method method name
   * @param args method arguments
   * @returns return value of the method, asynchronously.
   *
   * Obviously, any callable, non-serializable etc. members of that value
   * will not persist.
   */
  export function callPageMethod<M extends keyof {[K in keyof Page as Page[K] extends Function ? K : never]: Page[K]}>(method: M, ...args: Parameters<Page[M]>): Promise<Promised<ReturnType<Page[M]>>> {
    return __call<any, Promised<ReturnType<Page[M]>>>({ method, target: 'page', payload: args });
  }

  /**
   * Call a single method of a remote `Browser` in the current session.
   * @param method method name
   * @param args method arguments
   * @returns return value of the method, asynchronously.
   */
  export function callBrowserMethod<M extends keyof {[K in keyof Browser as Browser[K] extends Function ? K : never]: Browser[K]}>(method: M, ...args: Parameters<Browser[M]>): Promise<Promised<ReturnType<Browser[M]>>> {
    return __call<any, Promised<ReturnType<Browser[M]>>>({ method, target: 'browser', payload: args });
  }

  export function on<Key extends keyof WebcrawlerEvents>(type: Key, handler: Handler<Key>) {
    eventHandlers ||= {};
    eventHandlers[type] ||= [];
    // @ts-ignore
    eventHandlers[type].push(handler);
  }

  export function off<Key extends keyof WebcrawlerEvents>(type: Key, handler: (event: WebcrawlerEvents[Key]) => any) {
    eventHandlers ||= {};
    eventHandlers[type] ||= [];
    // @ts-ignore
    eventHandlers[type] = eventHandlers[type].filter(h => h !== handler);
  }

  function __call<Request, Response>(command: Request): Promise<Response> {
    const commandId = getRandomId();
    ws.send(JSON.stringify({ ...command, session: proxySessionId, id: commandId }));
    return new Promise((resolve, reject) => {
      let listener = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        if (message.session === proxySessionId && message.id === commandId) {
          if (message.type == 'result') {
            resolve(message.result);
            ws.removeEventListener('message', listener);
          } else if (message.type == 'error') {
            reject(message.error);
            ws.removeEventListener('message', listener);
          }
        }
      };
      ws.addEventListener('message', listener);
    });
  }

  function __handleMessage(event: MessageEvent) {
    const message = JSON.parse(event.data);
    if (message.session === proxySessionId) {
      if (message.type in eventHandlers) {
        // @ts-ignore
        for (const handler of eventHandlers[message.type]) {
          handler(message[message.type]);
        }
      }
    }
  }
}
