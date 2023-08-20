import { Page } from './page';

/**
 * Run a page locally in the browser at invisible frame,
 * through proxy
 */
export class LocalPageRunner implements Page {
  private sessionId!: string | number;
  private iframe!: HTMLIFrameElement;

  document?: Document;

  init(): Promise<void> {
    return fetch('/proxy/session')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.sessionId = data.id;
          } else {
            throw new Error('Failed to get proxy session: ' + ( data.error || 'Unknown error' ));
          }
          // create iframe
          this.iframe = document.createElement('iframe');
          this.iframe.style.display = 'none';
          this.iframe.addEventListener('load', () => {
            this.document = this.iframe.contentDocument || undefined;
          });
          document.body.append(this.iframe);
        });
  }

  fin(): Promise<void> {
    this.__checkInit();

    // remove iframe
    document.body.removeChild(this.iframe);

    return fetch(`/proxy/${this.sessionId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (!data.success) {
            throw new Error('Failed to delete proxy session' + ( data.error || 'Unknown error' ));
          }
        });
  }

  goto(url: URL | string): Promise<Response> {
    this.__checkInit();

    return new Promise((resolve: (value: ( PromiseLike<Response> | Response )) => void) => {
      const listener = () => {
        this.iframe.removeEventListener('load', listener);

        // fake response (we can't get real one from the page...)
        resolve(new Response());
      };
      this.iframe.addEventListener('load', listener);

      let urlString, urlURL;
      if (typeof url == 'string') {
        urlString = url;
        urlURL = new URL(url);
      } else {
        urlString = url.toString();
        urlURL = url;
      }
      if (urlURL.hostname == window.location.hostname) {
        this.iframe.src = urlString;
      } else {
        this.iframe.src = `/proxy/${this.sessionId}/goto/${encodeURIComponent(urlString)}`;
      }
    });
  }

  querySelector(selector: string): Element | null {
    this.__checkInit();
    if (!this.document) {
      return null;
    }

    return this.document.querySelector(selector);
  }

  querySelectorAll(selector: string): Element[] {
    this.__checkInit();
    if (!this.document) {
      return [];
    }

    const nodeList = this.document?.querySelectorAll(selector);
    return [...new Array(nodeList.length).keys()].map(i => nodeList.item(i));
  }

  private __checkInit() {
    if (this.iframe === undefined || this.sessionId === undefined) {
      throw new Error('Call init() first!');
    }
  }
}