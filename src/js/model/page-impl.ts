import {
  AwaitablePredicate,
  ClickOptions, Cookie, CookieParam,
  Credentials, DeleteCookieRequest,
  FrameAddStyleTagOptions,
  FrameAndScriptTagOptions, FrameWaitForFunctionOptions, GeoLocationOptions,
  GoToOptions, KeyboardTypeOptions, Metrics, NewDocumentScriptEvaluation,
  Page, PdfOptions, ScreenshotOptions, Viewport,
  WaitForOptions, WaitForSelectorOptions, WaitTimeoutOptions
} from './page';
import { getRandomId } from '../helper/random-helper';
import { API } from '../helper/api-helper';

type EventOptions = {
  button: number;
  shiftKey: boolean;
  pointerX: number;
  cancelable: boolean;
  pointerY: number;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  bubbles: boolean
};

/**
 * Run a page locally in the browser at invisible frame,
 * through proxy
 */
export class LocalPageRunner implements Page {
  private sessionId?: string | number;
  private iframe?: HTMLIFrameElement;

  private _evaluateOnNewDocumentFunc: Record<string, () => void> = {};
  private _exposedFunction: Record<string, {
    script: HTMLScriptElement;
    pptrFuncId: string
  }> = {};
  private _isJavaScriptEnabled: boolean = true;
  private _isServiceWorkerBypassed: boolean = false;
  private _proxyTimeoutSec?: number;
  private _waitTimeout?: number;
  private _viewport: Viewport | null = null;

  get document(): Document | undefined {
    return this.iframe?.contentDocument || undefined;
  }

  init(): Promise<void> {
    return API.get('/proxy/session')
        .then(data => {
          this.sessionId = data.id;
          // create iframe
          this.iframe = document.createElement('iframe');
          this.iframe.style.display = 'none';
          document.body.append(this.iframe);
        });
  }

  fin(): Promise<void> {
    this.__checkInit();

    // remove iframe
    document.body.removeChild(this.iframe!);
    this.iframe = undefined;

    return API.del(`/proxy/${this.sessionId}`)
        .then(() => {
          this.sessionId = undefined;
        });
  }

  goto(url: URL | string, options?: GoToOptions): Promise<Response> {
    this.__checkInit();

    return new Promise((resolve: (value: ( PromiseLike<Response> | Response )) => void) => {
      const listener = () => {
        this.iframe!.removeEventListener('load', listener);

        // fake response (we can't get real one from the page...)
        resolve(new Response());
      };
      this.iframe!.addEventListener('load', listener);

      let urlString, urlURL;
      if (typeof url == 'string') {
        urlString = url;
        urlURL = new URL(url);
      } else {
        urlString = url.toString();
        urlURL = url;
      }
      if (urlURL.hostname == window.location.hostname) {
        this.iframe!.src = urlString;
      } else {
        let apiUrl = this.__apiUrl(
            `/proxy/${this.sessionId}/goto/${encodeURIComponent(urlString)}`,
            { timeout: this._proxyTimeoutSec, options }
        );
        this.iframe!.src = apiUrl;
      }
    });
  }

  goBack(options?: WaitForOptions): Promise<Response> {
    this.__checkInit();

    return new Promise((resolve) => {
      const listener = () => {
        this.iframe!.removeEventListener('load', listener);

        // fake response
        resolve(new Response());
      };
      this.iframe!.addEventListener('load', listener);

      let apiUrl = this.__apiUrl(`/proxy/${this.sessionId}/go-back`,
          { timeout: this._proxyTimeoutSec, options });
      this.iframe!.src = apiUrl;
    });
  }

  goForward(options?: WaitForOptions): Promise<Response> {
    this.__checkInit();

    return new Promise((resolve) => {
      const listener = () => {
        this.iframe!.removeEventListener('load', listener);

        // fake response
        resolve(new Response());
      };
      this.iframe!.addEventListener('load', listener);

      let apiUrl = this.__apiUrl(`/proxy/${this.sessionId}/go-forward`,
          { timeout: this._proxyTimeoutSec, options });
      this.iframe!.src = apiUrl;
    });
  }

  isClosed(): boolean {
    return this.iframe === undefined || this.sessionId === undefined;
  }

  title(): Promise<string> {
    return Promise.resolve(this.document?.title || '');
  }

  url(): string {
    // can't get actual URL unless we do additional requests to the server
    throw new Error('`url` not implemented');
  }

  querySelector(selector: string): Element | null {
    this.__checkInit();
    this.__checkDocument();

    return this.document!.querySelector(selector);
  }

  $(selector: string) {
    return Promise.resolve(this.querySelector(selector));
  }

  querySelectorAll(selector: string): Element[] {
    this.__checkInit();
    this.__checkDocument();

    const nodeList = this.document!.querySelectorAll(selector);
    return [...new Array(nodeList.length).keys()].map(i => nodeList.item(i));
  }

  $$(selector: string) {
    return Promise.resolve(this.querySelectorAll(selector));
  }

  evaluate(pageFunction: Function | string, ...args: any[]): Promise<any> {
    return new Promise((resolve) => {
      this.__checkDocument();

      const script = this.document!.createElement('script');
      const funName = getRandomId();
      script.text = `window.${funName} = ${pageFunction.toString()};`;
      this.document!.head.appendChild(script);
      const result = ( this.iframe!.contentWindow as any )[funName](...args);

      resolve(result);
      this.document!.head.removeChild(script);
    });
  }

  $$eval(selector: string, pageFunction: Function | string, ...args: any[]): Promise<any> {
    return this.evaluate(pageFunction, this.querySelectorAll(selector), ...args);
  }

  $eval(selector: string, pageFunction: Function | string, ...args: any[]): Promise<any> {
    return this.evaluate(pageFunction, this.querySelector(selector), ...args);
  }

  addScriptTag(options: FrameAndScriptTagOptions): Promise<HTMLScriptElement> {
    return new Promise((resolve) => {
      this.__checkDocument();

      const script = this.document!.createElement('script');
      if (options.id) {
        script.id = options.id;
      }
      if (options.type) {
        script.type = options.type;
      }
      if (options.url) {
        script.src = options.url;
      }
      if (options.path) {
        throw new Error("Parameter `path` is irrelevant because " +
            "no local file system is available");
      }
      if (options.content) {
        script.text = options.content;
      }
      this.document!.head.appendChild(script);
      resolve(script);
    });
  }

  addStyleTag(options: FrameAndScriptTagOptions): Promise<any> {
    return new Promise((resolve) => {
      this.__checkDocument();

      const element = options.url ? this.document!.createElement('link') :
          this.document!.createElement('style');
      if (options.id) {
        element.id = options.id;
      }
      if (options.type) {
        element.type = options.type;
      }
      if (options.url) {
        ( element as HTMLLinkElement ).rel = 'stylesheet';
        ( element as HTMLLinkElement ).href = options.url;
      }
      if (options.path) {
        throw new Error("Parameter `path` is irrelevant because " +
            "no local file system is available");
      }
      if (options.content) {
        const contentNode = this.document!.createTextNode(options.content);
        element.appendChild(contentNode);
      }
      this.document!.head.appendChild(element);
      resolve(element);
    });
  }

  authenticate(credentials: Credentials): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/authenticate`, credentials)
        .then(() => {
        });
  }

  click(selector: string, options?: ClickOptions): Promise<void> {
    const element = this.querySelector(selector);
    if (!element) {
      throw Error(`Element by selector '${selector}' not found`);
    }
    this.__simulateMouseEvent(element, 'mousedown', options?.offset?.x, options?.offset?.y);
    this.__simulateMouseEvent(element, 'mouseup', options?.offset?.x, options?.offset?.y);
    this.__simulateMouseEvent(element, 'click', options?.offset?.x, options?.offset?.y);
    return Promise.resolve();
  }

  close(_options?: { runBeforeUnload?: boolean }): Promise<void> {
    return this.fin();
  }

  content(): Promise<string> {
    this.__checkDocument();

    const serializer = new XMLSerializer();
    return Promise.resolve(serializer.serializeToString(this.document!));
  }

  cookies(..._urls: string[]): Promise<Cookie[]> {
    // limited support of cookies is implemented, because
    // we can only get key-value pair and not additional fields from inside
    // the browser
    this.__checkDocument();

    const cookies = this.document!.cookie.split(';').map(namevalue => {
      const [name0, value0] = namevalue.split('=');
      const name = decodeURIComponent(name0.trim());
      const value = decodeURIComponent(value0.trim());
      return { name, value };
    });

    // @ts-ignore i said, limited support!
    return Promise.resolve(cookies);
  }

  deleteCookies(...cookies: DeleteCookieRequest[]): Promise<void> {
    // to delete a cookie, we can set it with a negative expiration date
    for (const cookie of cookies) {
      this.__setCookie({ [cookie.name]: '', 'max-age': '-1' });
    }
    return Promise.resolve();
  }

  evaluateOnNewDocument(pageFunction: Function | string, ...args: any[]): Promise<NewDocumentScriptEvaluation> {
    this.__checkInit();

    const funcId = getRandomId();
    const listener = () => {
      this.evaluate(pageFunction, ...args);
    }
    this.iframe!.addEventListener('load', listener);
    this._evaluateOnNewDocumentFunc[funcId] = listener;
    return Promise.resolve({ identifier: funcId });
  }

  exposeFunction(name: string, pptrFunction: Function | {
    default: Function
  }): Promise<void> {
    // can be implemented via exposing global function or via the messages,
    // let choose the dirtier option!
    const pptrFuncId = getRandomId();
    ( window as any )[pptrFuncId] = typeof pptrFunction == 'function' ?
        pptrFunction : pptrFunction.default;
    return this.addScriptTag({ content: `function ${name}() {return new Promise((resolve) => resolve(window.parent.${pptrFuncId}()));}` })
        .then((script) => {
          this._exposedFunction[name] = { script, pptrFuncId };
        });
  }

  focus(selector: string): Promise<void> {
    const element = this.querySelector(selector);
    if (!element) {
      throw new Error(`Element by selector '${selector}' not found`);
    }
    ( element as HTMLElement ).focus();
    return Promise.resolve();
  }

  hover(selector: string): Promise<void> {
    const element = this.querySelector(selector);
    if (!element) {
      throw new Error(`Element by selector '${selector}' not found`);
    }
    this.__simulateMouseEvent(element, 'mouseover');
    return Promise.resolve();
  }

  isJavaScriptEnabled(): boolean {
    return this._isJavaScriptEnabled;
  }

  isServiceWorkerBypassed(): boolean {
    return this._isServiceWorkerBypassed;
  }

  metrics(): Promise<Metrics> {
    // any Metrics collected from the server (proxy) side will be
    // (in the common case) invalid since we're modifying page by the local
    // script. And a browser doesn't generally support such a functionality.
    // Thus, no way to correctly collect metrics in the common case.
    // The same is applied to pdfs and screenshots.
    throw new Error('`metrics` not implemented');
  }

  pdf(_options?: PdfOptions): Promise<Buffer> {
    throw new Error('`pdf` not implemented');
  }

  reload(options?: WaitForOptions): Promise<Response> {
    this.__checkInit();

    return new Promise((resolve) => {
      const listener = () => {
        this.iframe!.removeEventListener('load', listener);

        // fake response
        resolve(new Response());
      }

      this.iframe!.addEventListener('load', listener);
      let apiUrl: string = this.__apiUrl(`/proxy/${this.sessionId}/reload`,
          { timeout: this._proxyTimeoutSec, options });
      this.iframe!.src = apiUrl;
    });
  }

  removeExposedFunction(name: string): Promise<void> {
    let { script, pptrFuncId } = this._exposedFunction[name] || {};
    if (this.document && script && script.parentNode == this.document.head) {
      this.document.head.removeChild(script);
      delete ( window as any )[pptrFuncId];
      delete this._exposedFunction[name];
    }
    return Promise.resolve();
  }

  removeScriptToEvaluateOnNewDocument(identifier: string): Promise<void> {
    if (this._evaluateOnNewDocumentFunc[identifier]) {
      this.document?.removeEventListener('load', this._evaluateOnNewDocumentFunc[identifier]);
      delete this._evaluateOnNewDocumentFunc[identifier];
    }
    return Promise.resolve();
  }

  screenshot(_options?: ScreenshotOptions): Promise<any> {
    throw new Error('`screenshot` not implemented');
  }

  select(selector: string, ...values: string[]): Promise<string[]> {
    const element = this.querySelector(selector);
    if (!element) {
      throw new Error(`Element by selector '${selector}' not found`);
    }
    if (!( element instanceof HTMLSelectElement )) {
      throw new Error(`Element by selector '${selector}' is not \`<select>\``);
    }
    if (!element.multiple) {
      element.value = values[0];
      return Promise.resolve([element.value]);
    }
    let allOptions = element.getElementsByTagName('option');
    let selectedValues = [];
    for (let i = 0; i < allOptions.length; i++) {
      const option = allOptions.item(i);
      option!.selected = values.indexOf(option!.value) !== -1;
      selectedValues.push(option!.value);
    }
    return Promise.resolve(selectedValues);
  }

  setBypassCSP(enabled: boolean): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-bypass-csp`, enabled);
  }

  setBypassServiceWorker(_bypass: boolean): Promise<void> {
    throw new Error('`setBypassServiceWorker` not implemented');
  }

  setCacheEnabled(enabled?: boolean): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-cache-enabled`, enabled);
  }

  setContent(html: string, _options?: WaitForOptions): Promise<void> {
    this.__checkInit();

    const oldDoc = this.document;
    this.iframe!.srcdoc = html;
    return this.__waitInterval(() => ({ success: this.document != oldDoc }), 100);
  }

  setCookie(...cookies: CookieParam[]): Promise<void> {
    for (const cookie of cookies) {
      this.__setCookie({
        [cookie.name]: cookie.value,
        domain: cookie.domain,
        path: cookie.path || '/',
        expires: cookie.expires ? new Date(cookie.expires).toUTCString() : undefined,
        secure: cookie.secure,
        samesite: cookie.sameSite,
        httpOnly: cookie.httpOnly,
      });
    }
    return Promise.resolve();
  }

  setDefaultNavigationTimeout(timeout: number) {
    this._proxyTimeoutSec = Math.ceil(timeout / 1000);
  }

  setDefaultTimeout(timeout: number) {
    this._waitTimeout = timeout;
  }

  setExtraHTTPHeaders(headers: Record<string, string>): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-extra-http-headers`, headers);
  }

  setGeolocation(_options: GeoLocationOptions): Promise<void> {
    throw new Error('`setGeoLocation` not implemented');
  }

  setJavaScriptEnabled(enabled: boolean): Promise<void> {
    // this will affect only JavaScript during processing on the (proxy) server,
    // local JavaScript in iframe is available anyway
    return API.post(`/proxy/${this.sessionId}/set-javascript-enabled`,
        this._isJavaScriptEnabled = enabled);
  }

  setOfflineMode(enabled: boolean): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-offline-mode`, enabled);
  }

  setRequestInterception(_enabled: boolean): Promise<void> {
    throw new Error('`setRequestInterception` not implemented');
  }

  setUserAgent(userAgent: string): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-user-agent`, userAgent);
  }

  setViewport(viewport: Viewport): Promise<void> {
    return API.post(`/proxy/${this.sessionId}/set-viewport`,
        this._viewport = viewport);
  }

  tap(_selector: string): Promise<void> {
    throw new Error('`tap` not implemented');
  }

  type(selector: string, text: string, options?: KeyboardTypeOptions): Promise<void> {
    const element = this.querySelector(selector);
    if (!element) {
      throw new Error(`Element by selector '${selector}' not found`);
    }
    if (!options?.delay) {
      for (const char of text) {
        this.__simulateKeyboardEvent(element, 'keydown', char);
        this.__simulateKeyboardEvent(element, 'keyup', char);
        this.__simulateKeyboardEvent(element, 'keypress', char);
        this.__simulateInput(element, char);
      }
      return Promise.resolve();
    }
    const chars = Array.from(text);
    return this.__waitInterval(() => {
      const char = chars.shift();
      if (!char) {
        return { success: true };
      }
      this.__simulateKeyboardEvent(element, 'keydown', char);
      this.__simulateKeyboardEvent(element, 'keyup', char);
      this.__simulateKeyboardEvent(element, 'keypress', char);
      this.__simulateInput(element, char);
      return { success: !chars.length };
    }, options.delay);
  }

  viewport(): Viewport | null {
    return this._viewport;
  }

  waitForFunction(pageFunction: Function | string, options?: FrameWaitForFunctionOptions, ...args: any[]): Promise<any> {
    this.__checkDocument();

    const poll = () => {
      return this.evaluate(pageFunction, ...args)
          .then(result => ({ success: !!result, result }));
    }

    const polling = options?.polling || 'raf';
    const timeout = options?.timeout || this._waitTimeout;
    const message = `Function ${pageFunction} awaiting timeout ${timeout}ms`;
    if (typeof polling == 'number') {
      return this.__waitInterval(poll, polling, timeout, message);
    } else if (polling == 'raf') {
      return this.__waitRAF(poll, timeout, message);
    } else if (polling == 'mutation') {
      // here we're probably in trouble, because our `evaluate` implementation
      // itself mutates the DOM, so it'll trigger poll chaotically,
      // but let keep a straightforward implementation for now...
      return this.__waitDOM(poll, timeout, message);
    } else {
      throw new Error(`Polling method ${polling} not supported`);
    }
  }

  waitForNavigation(_options?: WaitForOptions): Promise<Response> {
    throw new Error('`waitForNavigation` not implemented');
  }

  waitForRequest(_urlOrPredicate: string | AwaitablePredicate<Request>, _options?: WaitTimeoutOptions): Promise<Request> {
    throw new Error('`waitForRequest` not implemented');
  }

  waitForResponse(_urlOrPredicate: string | AwaitablePredicate<Response>, _options?: WaitTimeoutOptions): Promise<Response> {
    throw new Error('`waitForResponse` not implemented');
  }

  waitForSelector(selector: string, options?: WaitForSelectorOptions): Promise<Element | null> {
    this.__checkDocument();

    const poll = () => {
      const element = this.querySelector(selector);
      let success;
      if (options?.hidden) {
        success = element == null || ( element as HTMLElement ).style.display == 'none'
            || ( element as HTMLElement ).style.visibility == 'hidden';
      } else if (options?.visible) {
        success = !( ( element as HTMLElement ).style.display == 'none'
            || ( element as HTMLElement ).style.visibility == 'hidden' );
      } else {
        success = !!element;
      }
      return { success, result: element };
    }

    const { success, result } = poll();
    if (success) {
      return Promise.resolve(result);
    }
    let timeout = options?.timeout || this._waitTimeout;
    return this.__waitDOM(poll, timeout,
        `Element by selector '${selector}' awaiting timeout ${timeout}ms`);
  }

  private __checkInit() {
    if (this.iframe === undefined || this.sessionId === undefined) {
      throw new Error('Call init() first!');
    }
  }

  private __checkDocument() {
    if (this.document === undefined) {
      throw new Error('No document is  open');
    }
  }

  private __waitRAF<T>(poll: () => { success: boolean, result: T } | Promise<{ success: boolean, result: T }>,
                       timeout?: number, message?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutHandle: NodeJS.Timeout;

      const checkup = ({ success, result }: { success: boolean, result: T }) => {
        if (success) {
          resolve(result);
          this.iframe!.contentWindow!.cancelAnimationFrame(rafId);
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }
        }
      };

      const rafId = this.iframe!.contentWindow!.requestAnimationFrame(() => {
        const result = poll();
        if (result instanceof Promise) {
          result.then(checkup);
        } else {
          checkup(result);
        }
      });

      if (timeout) {
        timeoutHandle = setTimeout(() => {
          reject(message);
          this.iframe!.contentWindow!.cancelAnimationFrame(rafId);
        }, timeout);
      }
    });
  }

  private __waitDOM<T>(poll: () => {
    success: boolean;
    result: T
  } | Promise<{
    success: boolean;
    result: T
  }>, timeout?: number, message?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutHandle: NodeJS.Timeout;

      const checkup = ({ success, result }: { success: boolean, result: T }) => {
        if (success) {
          resolve(result);
          observer.disconnect();
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
          }
        }
      };

      const observer = new MutationObserver(() => {
        const result = poll();
        if (result instanceof Promise) {
          result.then(checkup);
        } else {
          checkup(result);
        }
      });
      observer.observe(this.document!.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
      });

      if (timeout) {
        timeoutHandle = setTimeout(() => {
          reject(message);
          observer.disconnect();
        }, timeout);
      }
    });
  }

  private __waitInterval(poll: () => { success: boolean } | Promise<{ success: boolean }>, polling?: number, timeout?: number, message?: any): Promise<void>;
  private __waitInterval<T>(poll: () => {
    success: boolean,
    result: T
  } | Promise<{
    success: boolean, result: T
  }>, polling?: number, timeout?: number, message?: any) {
    const t0 = Date.now();
    return new Promise((resolve, reject) => {
      function checkup({ success, result }: { success: boolean, result: T }) {
        if (success) {
          resolve(result);
        } else if (timeout && Date.now() - t0 >= timeout) {
          reject(message);
        } else {
          setTimeout(tick, polling);
        }
      }

      function tick() {
        const result = poll();
        if (result instanceof Promise) {
          result.then(checkup);
        } else {
          checkup(result);
        }
      }

      tick();
    });
  }

  // @ts-ignore this is spooky but let it be in case nothing other works
  // all credits are to this kind person:
  // https://gist.github.com/ken107/c56c6a69bf3c18995af8a02ec875900c
  private _simulateEvent(element: Element, eventName: string, options: Partial<EventOptions>) {
    this.__checkDocument();

    const opt: EventOptions = {
      pointerX: 0,
      pointerY: 0,
      button: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      bubbles: true,
      cancelable: true,
    }
    Object.assign(opt, options);

    let event;
    switch (eventName) {
      case 'unload':
      case 'abort':
      case 'error':
      case 'select':
      case 'change':
      case 'submit':
      case 'reset':
      case 'focus':
      case 'blur':
      case 'resize':
      case 'scroll':
        event = this.document!.createEvent('HTMLEvents');
        event.initEvent(eventName, opt.bubbles, opt.cancelable);
        break;

      case 'click':
      case 'dblclick':
      case 'mousedown':
      case 'mouseup':
      case 'mouseover':
      case 'mousemove':
      case 'mouseout':
      case 'keydown':
      case 'keyup':
        event = this.document!.createEvent('MouseEvents');
        event.initMouseEvent(eventName, opt.bubbles, opt.cancelable,
            this.document!.defaultView as Window,
            opt.button, opt.pointerX, opt.pointerY, opt.pointerX, opt.pointerY,
            opt.ctrlKey, opt.altKey, opt.shiftKey, opt.metaKey, opt.button,
            element);
        break;

      default:
        throw new Error(`Event name "${eventName}" is not supported`);
    }

    element.dispatchEvent(event);
  }

  private __simulateMouseEvent(element: Element, eventName: string, x?: number, y?: number) {
    this.__checkDocument();

    const box = element.getBoundingClientRect();
    x ||= box.left + ( box.right - box.left ) / 2;
    y ||= box.top + ( box.bottom - box.top ) / 2;

    element.dispatchEvent(new MouseEvent(eventName, {
      view: this.document!.defaultView as Window,
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0,
    }));
  }

  private __simulateKeyboardEvent(element: Element, eventName: string, key: string) {
    element.dispatchEvent(new KeyboardEvent(eventName, {
      bubbles: true,
      cancelable: true,
      key,
      charCode: key.charCodeAt(0),
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      metaKey: false,
    }));
  }

  private __simulateInput(element: Element, key: string) {
    let input;
    if (element.tagName == 'INPUT') {
      input = element as HTMLInputElement;
    } else {
      input = element.querySelector('input') ||
          element.shadowRoot?.querySelector('input') || null;
    }

    if (!input) {
      // we don't know how to simulate typing on an element,
      // unless it's an input or some custom element with underlying input
      return;
    }

    input.value = input.value + key;
  }

  private __setCookie(attributes: Record<string, string | boolean | undefined>) {
    this.__checkDocument();
    this.document!.cookie = Object.entries(attributes)
        .map(([key, value]) => {
          switch (typeof value) {
            case 'string':
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            case 'boolean':
              return `${encodeURIComponent(key)}`;
            default:
              return undefined;
          }
        })
        .filter(s => s != undefined)
        .join('; ');
  }

  private __apiUrl(url: string, data: any) {
    if (data) {
      const queryparams: Record<string, string> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value == undefined) {
        } else if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
          queryparams[key] = `${value}`;
        } else {
          queryparams[key] = JSON.stringify(value);
        }
      }
      url += `?` + Object.entries(queryparams)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
    }
    return url;
  }
}
