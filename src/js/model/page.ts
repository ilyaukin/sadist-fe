/**
 * Page object which a script runs on. Provides an abstraction of
 * handling the page, such as navigation and information grabbing.
 *
 * This interface is build with an idea to be compatible with
 * puppeteer's Page, (though maybe with some nuances), so a user can run
 * puppeteer scripts on our app and vice versa. Because puppeteer doesn't
 * declare interfaces separately, we can't reuse it without actually
 * bundling it, which is undesirable.
 */
export interface Page {
  /**
   * Current document of the page. Be aware that actions with it
   * such as clicking links can cause page reload and thus it's invalidation
   */
  readonly document?: Document;

  /**
   * goto URL
   * @param url URL
   * @param options Options to configure waiting behaviour
   */
  goto(url: URL | string, options?: GoToOptions): Promise<Response>;

  /**
   * goto previous page in history
   * @param options Navigation parameters
   */
  goBack(options?: WaitForOptions): Promise<Response>;

  /**
   * goto next page in history
   * @param options
   */
  goForward(options?: WaitForOptions): Promise<Response>;

  /**
   * indicate that the page is closed
   */
  isClosed(): boolean;

  /**
   * get page's title
   */
  title(): Promise<string>;

  /**
   * get page's URL
   */
  url(): string;

  /**
   * Normally, a shortcut for {@link document.documentElement.querySelector()}
   * @param selector css selector
   */
  querySelector(selector: string): Element | null;

  /**
   * Asynchronous puppeteer-like version of {@link querySelector}
   * @param selector
   */
  $(selector: string): Promise<Element | null>;

  /**
   * Normally, a shortcut for {@link document.documentElement.querySelectorAll()}
   * @param selector
   */
  querySelectorAll(selector: string): Element[];

  /**
   * Asynchronous puppeteer-like version of {@link querySelectorAll}
   * @param selector
   */
  $$(selector: string): Promise<Element[]>;

  /**
   * Evaluate a function in the page's context and return the result.
   *
   * If the function passed to `evaluate` returns Promise, the function
   * will await for the Promise to resolve and return its value.
   * @param pageFunction
   * @param args
   */
  evaluate(pageFunction: Function | string, ...args: any): Promise<any>;

  /**
   * Evaluate a function on {@link querySelectorAll} result within the page
   * @param selector selector to query for
   * @param pageFunction function to be evaluated
   * @param args any additional arguments to pass to `pageFunction`
   */
  $$eval(selector: string, pageFunction: Function | string, ...args: any[]): Promise<any>;

  /**
   * Evaluate a function on {@link querySelector} result within the page
   * @param selector selector to query for
   * @param pageFunction function to be evaluated
   * @param args any additional arguments to pass to `pageFunction`
   */
  $eval(selector: string, pageFunction: Function | string, ...args: any[]): Promise<any>;

  /**
   * Add a `<script>` tag into the page with the desired URL or content.
   * @param options Options for the script
   */
  addScriptTag(options: FrameAndScriptTagOptions): Promise<HTMLScriptElement>;

  /**
   * Add a `<link rel="stylesheet">` tag into the page with the desired URL
   * or a `<style type="text/css">` tag with the content.
   * @param options Options for the style
   */
  addStyleTag(options: Omit<FrameAddStyleTagOptions, 'url'>): Promise<HTMLStyleElement>;
  addStyleTag(options: FrameAndScriptTagOptions): Promise<HTMLLinkElement>;

  /**
   * Provide credentials for HTTP authentication.
   * @param credentials
   */
  authenticate(credentials: Credentials): Promise<void>;

  /**
   * Emulate click on an element
   * @param selector a selector to search for element to click
   * @param options
   */
  click(selector: string, options?: ClickOptions): Promise<void>;

  close(options?: { runBeforeUnload?: boolean }): Promise<void>;

  /**
   * The full HTML content of the page, including the DOCTYPE.
   */
  content(): Promise<string>;

  /**
   * If no URLs are specified, this method returns cookies for the
   * current page URL. If URLs are specified, only cookies for those
   * URLs are returned.
   * @param urls
   */
  cookies(...urls: string[]): Promise<Cookie[]>;

  deleteCookies(...cookies: DeleteCookieRequest[]): Promise<void>;

  evaluateOnNewDocument(pageFunction: Function | string, ...args: any): Promise<NewDocumentScriptEvaluation>;

  /**
   * Add a function to the page's window, which calls `pptrFunction`
   * in the context of the script which runs the page (given it is different
   * from the page's own context, otherwise it does not make much sense),
   * and returns a Promise which resolves to the return value of `pptrFunction`.
   * @param name Name of the function to add
   * @param pptrFunction Callback which is called in page runner context
   */
  exposeFunction(name: string, pptrFunction: Function | {
    default: Function
  }): Promise<void>;

  /**
   * Focus an element by given `selector`.
   * @param selector a selector of the element to focus, if there are multiple
   * elements satisfying the selector, the first will be focused.
   */
  focus(selector: string): Promise<void>;

  /**
   * Emulate hover an element
   * @param selector
   */
  hover(selector: string): Promise<void>;

  /**
   * `true` if the page has JavaScript enabled
   */
  isJavaScriptEnabled(): boolean;

  /**
   * `true` if the service worker are being bypassed
   */
  isServiceWorkerBypassed(): boolean;

  /**
   * Obtain containing metrics
   */
  metrics(): Promise<Metrics>;

  /**
   * Generate a PDF of the page
   * @param options options for PDF generating
   */
  pdf(options?: PdfOptions): Promise<Buffer>;

  /**
   * Reload the page
   * @param options
   */
  reload(options?: WaitForOptions): Promise<Response>;

  /**
   * Remove a function, previously added by `exposeFunction`
   * @param name
   */
  removeExposedFunction(name: string): Promise<void>;

  /**
   * Remove script that injected into page by `evaluateOnNewDocument`
   * @param identifier
   */
  removeScriptToEvaluateOnNewDocument(identifier: string): Promise<void>;

  /**
   * Capture a screenshot of the page
   * @param options
   */
  screenshot(options?: ScreenshotOptions & { encoding: 'base64' }): Promise<string>;
  screenshot(options?: ScreenshotOptions): Promise<Buffer>;

  /**
   * Emulate select values in the `select` element
   * @param selector a selector to query for
   * @param values Values to select. If the `select` has `multiple` attribute,
   * all values are considered, otherwise only the first one.
   */
  select(selector: string, ...values: string[]): Promise<string[]>;

  /**
   * Toggle bypassing page's Content Security Policy
   * @param enabled
   */
  setBypassCSP(enabled: boolean): Promise<void>;

  /**
   * Toggle ignoring service worker for each request.
   * @param bypass
   */
  setBypassServiceWorker(bypass: boolean): Promise<void>;

  /**
   * Toggle ignoring cache for each request. By default, caching is enabled.
   * @param enabled
   */
  setCacheEnabled(enabled?: boolean): Promise<void>;

  /**
   * Set the content of the page
   * @param html HTML content to assign to the page
   * @param options optional parameters
   */
  setContent(html: string, options?: WaitForOptions): Promise<void>;

  setCookie(...cookies: CookieParam[]): Promise<void>;

  /**
   * Change maximum default navigation timeout.
   * @param timeout Timeout in milliseconds
   */
  setDefaultNavigationTimeout(timeout: number): void;

  setDefaultTimeout(timeout: number): void;

  /**
   * Set extra HTTP headers will be sent with every request the page initiates.
   * @param headers An object containing additional HTTP headers
   */
  setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;

  /**
   * Set the page's geolocation
   * @param options
   */
  setGeolocation(options: GeoLocationOptions): Promise<void>;

  setJavaScriptEnabled(enabled: boolean): Promise<void>;

  /**
   * Set the network connection to offline
   * @param enabled
   */
  setOfflineMode(enabled: boolean): Promise<void>;

  /**
   * Activating request interception enables `HTTPRequest.abort()`,
   * `HTTPRequest.continue()` and `HTTPRequest.respond()`, this provides
   * a capability to modify HTTP requests sent by the page.
   *
   * Once request interception is enabled, every request will stall
   * until it's continued, responded or aborted, or completed using
   * the browser cache.
   * @param enabled
   */
  setRequestInterception(enabled: boolean): Promise<void>;

  /**
   * Set user agent
   * @param userAgent
   */
  setUserAgent(userAgent: string): Promise<void>;

  /**
   * Resize the page.
   * @param viewport
   */
  setViewport(viewport: Viewport): Promise<void>;

  /**
   * Emulate tap on an element
   * @param selector
   */
  tap(selector: string): Promise<void>;

  /**
   * Emulate typing of each character of the text
   * @param selector
   * @param text
   * @param options
   */
  type(selector: string, text: string, options?: KeyboardTypeOptions): Promise<void>;

  /**
   * Return the current page viewport.
   *
   * This is either the viewport, set with the previous `setViewport`,
   * or the default viewport (set via initializing the page??? not sure)
   */
  viewport(): Viewport | null;

  /**
   * Wait for the provided function, `pageFunction`, to return a truthy value
   * when evaluated in the page's context.
   * @param pageFunction Function to be evaluated
   * @param options Options
   * @param args
   */
  waitForFunction(pageFunction: Function | string, options?: FrameWaitForFunctionOptions, ...args: any[]): Promise<any>;

  /**
   * Wait for the page to navigate to a new URL or reload.
   * @param options
   */
  waitForNavigation(options?: WaitForOptions): Promise<Response>;

  waitForRequest(urlOrPredicate: string | AwaitablePredicate<Request>, options?: WaitTimeoutOptions): Promise<Request>;

  waitForResponse(urlOrPredicate: string | AwaitablePredicate<Response>, options?: WaitTimeoutOptions): Promise<Response>;

  /**
   * Wait for `selector` to appear on the page
   * @param selector
   * @param options
   */
  waitForSelector(selector: string, options?: WaitForSelectorOptions): Promise<Element | null>;
}

export interface WaitForOptions {
  timeout?: number;
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
}

export interface GoToOptions extends WaitForOptions {
  referer?: string;
  referrerPolicy?: string;
}

export type PuppeteerLifeCycleEvent =
    'load'
    | 'domcontentloaded'
    | 'networkidle0'
    | 'networkidle2';

export interface FrameAndScriptTagOptions {
  content?: string;
  id?: string;
  path?: string;
  type?: string;
  url?: string;
}

export interface FrameAddStyleTagOptions {
  content?: string;
  path?: string;
  url?: string;
}

export interface Credentials {
  password: string;
  username: string;
}

export interface Offset {
  x: number;
  y: number;
}

export enum MouseButton {
  Left = 'left',
  Right = 'right',
  Middle = 'middle',
  Back = 'back',
  Forward = 'forward',
}

export interface MouseOptions {
  button?: MouseButton;
  clickCount?: number;
}

export interface MouseClickOptions extends MouseOptions {
  count?: number;
  delay?: number;
}

export interface ClickOptions extends MouseClickOptions {
  offset?: Offset;
}

export type CookiePriority = 'Low' | 'Medium' | 'High';

export type CookieSameSite = 'Strict' | 'Lax' | 'None';

export type CookieSourceScheme = 'Unset' | 'NonSecure' | 'Secure';

export interface Cookie {
  domain: string;
  expires: number;
  httpOnly: boolean;
  name: string;
  partitionKey?: string;
  partitionKeyOpaque?: boolean;
  path: string;
  priority?: CookiePriority;
  sameParty?: boolean;
  sameSite?: CookieSameSite;
  secure: boolean;
  size: number;
  sourceScheme?: CookieSourceScheme;
  value: string;
}

export interface CookieParam {
  domain?: string;
  expires?: number;
  httpOnly?: boolean;
  name: string;
  partitionKey?: string;
  path?: string;
  priority?: CookiePriority;
  sameParty?: boolean;
  sameSite?: CookieSameSite;
  secure?: boolean;
  sourceSchema?: CookieSourceScheme;
  url?: string;
  value: string;
}

export interface DeleteCookieRequest {
  domain?: string;
  name: string;
  path?: string;
  url?: string;
}

export interface NewDocumentScriptEvaluation {
  identifier: string;
}

export interface Metrics {
  Documents?: number;
  Frames?: number;
  JSEventListeners?: number;
  JSHeapTotalSize?: number;
  JSHeapUsedSize?: number;
  LayoutCount?: number;
  LayoutDuration?: number;
  Nodes?: number;
  RecalcStyleCount?: number;
  RecalcStyleDuration?: number;
  ScriptDuration?: number;
  TaskDuration?: number;
  Timestamp?: number;
}

export type LowerCasePaperFormat =
    'letter'
    | 'legal'
    | 'tabloid'
    | 'ledger'
    | 'a0'
    | 'a1'
    | 'a2'
    | 'a3'
    | 'a4'
    | 'a5'
    | 'a6';

export type PaperFormat =
    Uppercase<LowerCasePaperFormat>
    | Capitalize<LowerCasePaperFormat>
    | LowerCasePaperFormat;

export interface PdfMargin {
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  top?: string | number;
}

export interface PdfOptions {
  displayHeaderFooter?: boolean;
  footerTemplate?: string;
  format?: PaperFormat;
  headerTemplate?: string;
  height?: string | number;
  landscape?: boolean;
  margin?: PdfMargin;
  omitBackground?: boolean;
  outline?: boolean;
  pageRanges?: string;
  path?: string;
  preferCSSPageSize?: boolean;
  printBackground?: boolean;
  scale?: number;
  tagged?: boolean;
  timeout?: number;
  width?: string | number;
}

export interface ScreenshotClip {
  scale?: number;
}

export interface ScreenshotOptions {
  captureBeyondViewport?: boolean;
  clip?: ScreenshotClip;
  encoding?: 'base64' | 'binary';
  fromSurface?: boolean;
  fullPage?: boolean;
  omitBackground?: boolean;
  optimizeForSpeed?: boolean;
  path?: string;
  quality?: number;
  type?: 'png' | 'jpeg' | 'webp';
}

export interface GeoLocationOptions {
  accuracy?: number;
  latitude?: number;
  longitude?: number;
}

export interface Viewport {
  deviceScaleFactor?: number;
  hasTouch?: boolean;
  height: number;
  isLandscape?: boolean;
  isMobile?: boolean;
  width: number;
}

export interface KeyboardTypeOptions {
  delay?: number;
}

export interface FrameWaitForFunctionOptions {
  polling?: 'raf' | 'mutation' | number;
  signal?: AbortSignal;
  timeout?: number;
}

export type AwaitablePredicate<T> = (value: T) => Promise<boolean>;

export interface WaitTimeoutOptions {
  timeout?: number;
}

export interface WaitForSelectorOptions {
  hidden?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  visible?: boolean;
}
