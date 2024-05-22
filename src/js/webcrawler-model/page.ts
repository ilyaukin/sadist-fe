/**
 * All the valid keys that can be passed to functions that take user input, such
 * as {@link Keyboard.press | keyboard.press}
 *
 * @public
 */
export type KeyInput =
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'Power'
    | 'Eject'
    | 'Abort'
    | 'Help'
    | 'Backspace'
    | 'Tab'
    | 'Numpad5'
    | 'NumpadEnter'
    | 'Enter'
    | '\r'
    | '\n'
    | 'ShiftLeft'
    | 'ShiftRight'
    | 'ControlLeft'
    | 'ControlRight'
    | 'AltLeft'
    | 'AltRight'
    | 'Pause'
    | 'CapsLock'
    | 'Escape'
    | 'Convert'
    | 'NonConvert'
    | 'Space'
    | 'Numpad9'
    | 'PageUp'
    | 'Numpad3'
    | 'PageDown'
    | 'End'
    | 'Numpad1'
    | 'Home'
    | 'Numpad7'
    | 'ArrowLeft'
    | 'Numpad4'
    | 'Numpad8'
    | 'ArrowUp'
    | 'ArrowRight'
    | 'Numpad6'
    | 'Numpad2'
    | 'ArrowDown'
    | 'Select'
    | 'Open'
    | 'PrintScreen'
    | 'Insert'
    | 'Numpad0'
    | 'Delete'
    | 'NumpadDecimal'
    | 'Digit0'
    | 'Digit1'
    | 'Digit2'
    | 'Digit3'
    | 'Digit4'
    | 'Digit5'
    | 'Digit6'
    | 'Digit7'
    | 'Digit8'
    | 'Digit9'
    | 'KeyA'
    | 'KeyB'
    | 'KeyC'
    | 'KeyD'
    | 'KeyE'
    | 'KeyF'
    | 'KeyG'
    | 'KeyH'
    | 'KeyI'
    | 'KeyJ'
    | 'KeyK'
    | 'KeyL'
    | 'KeyM'
    | 'KeyN'
    | 'KeyO'
    | 'KeyP'
    | 'KeyQ'
    | 'KeyR'
    | 'KeyS'
    | 'KeyT'
    | 'KeyU'
    | 'KeyV'
    | 'KeyW'
    | 'KeyX'
    | 'KeyY'
    | 'KeyZ'
    | 'MetaLeft'
    | 'MetaRight'
    | 'ContextMenu'
    | 'NumpadMultiply'
    | 'NumpadAdd'
    | 'NumpadSubtract'
    | 'NumpadDivide'
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12'
    | 'F13'
    | 'F14'
    | 'F15'
    | 'F16'
    | 'F17'
    | 'F18'
    | 'F19'
    | 'F20'
    | 'F21'
    | 'F22'
    | 'F23'
    | 'F24'
    | 'NumLock'
    | 'ScrollLock'
    | 'AudioVolumeMute'
    | 'AudioVolumeDown'
    | 'AudioVolumeUp'
    | 'MediaTrackNext'
    | 'MediaTrackPrevious'
    | 'MediaStop'
    | 'MediaPlayPause'
    | 'Semicolon'
    | 'Equal'
    | 'NumpadEqual'
    | 'Comma'
    | 'Minus'
    | 'Period'
    | 'Slash'
    | 'Backquote'
    | 'BracketLeft'
    | 'Backslash'
    | 'BracketRight'
    | 'Quote'
    | 'AltGraph'
    | 'Props'
    | 'Cancel'
    | 'Clear'
    | 'Shift'
    | 'Control'
    | 'Alt'
    | 'Accept'
    | 'ModeChange'
    | ' '
    | 'Print'
    | 'Execute'
    | '\u0000'
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
    | 'Meta'
    | '*'
    | '+'
    | '-'
    | '/'
    | ';'
    | '='
    | ','
    | '.'
    | '`'
    | '['
    | '\\'
    | ']'
    | "'"
    | 'Attn'
    | 'CrSel'
    | 'ExSel'
    | 'EraseEof'
    | 'Play'
    | 'ZoomOut'
    | ')'
    | '!'
    | '@'
    | '#'
    | '$'
    | '%'
    | '^'
    | '&'
    | '('
    | 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'X'
    | 'Y'
    | 'Z'
    | ':'
    | '<'
    | '_'
    | '>'
    | '?'
    | '~'
    | '{'
    | '|'
    | '}'
    | '"'
    | 'SoftLeft'
    | 'SoftRight'
    | 'Camera'
    | 'Call'
    | 'EndCall'
    | 'VolumeDown'
    | 'VolumeUp';

export interface KeyDownOptions {
  /**
   * @deprecated Do not use. This is automatically handled.
   */
  text?: string;
  /**
   * @deprecated Do not use. This is automatically handled.
   */
  commands?: string[];
}

/**
 * @public
 */
export interface KeyboardTypeOptions {
  delay?: number;
}

/**
 * @public
 */
export type KeyPressOptions = KeyDownOptions & KeyboardTypeOptions;

interface Keyboard {
  down(
      key: KeyInput,
      options?: Readonly<KeyDownOptions>
  ): Promise<void>;

  up(key: KeyInput): Promise<void>;

  sendCharacter(char: string): Promise<void>;

  type(
      text: string,
      options?: Readonly<KeyboardTypeOptions>
  ): Promise<void>;

  press(
      key: KeyInput,
      options?: Readonly<KeyPressOptions>
  ): Promise<void>;
}

interface Touchscreen {
  /**
   * Dispatches a `touchstart` and `touchend` event.
   * @param x - Horizontal position of the tap.
   * @param y - Vertical position of the tap.
   */
  tap(x: number, y: number): Promise<void>;

  touchStart(x: number, y: number): Promise<void>;

  touchMove(x: number, y: number): Promise<void>;

  touchEnd(): Promise<void>;
}

/**
 * The CoverageEntry class represents one entry of the coverage report.
 * @public
 */
export interface CoverageEntry {
  /**
   * The URL of the style sheet or script.
   */
  url: string;
  /**
   * The content of the style sheet or script.
   */
  text: string;
  /**
   * The covered range as start and end positions.
   */
  ranges: Array<{ start: number; end: number }>;
}

/**
 * The CoverageEntry class for JavaScript
 * @public
 */
export interface JSCoverageEntry extends CoverageEntry {
  /**
   * Raw V8 script coverage entry.
   */
  rawScriptCoverage?: any;
}

/**
 * Set of configurable options for JS coverage.
 * @public
 */
export interface JSCoverageOptions {
  /**
   * Whether to reset coverage on every navigation.
   */
  resetOnNavigation?: boolean;
  /**
   * Whether anonymous scripts generated by the page should be reported.
   */
  reportAnonymousScripts?: boolean;
  /**
   * Whether the result includes raw V8 script coverage entries.
   */
  includeRawScriptCoverage?: boolean;
  /**
   * Whether to collect coverage information at the block level.
   * If true, coverage will be collected at the block level (this is the default).
   * If false, coverage will be collected at the function level.
   */
  useBlockCoverage?: boolean;
}

/**
 * Set of configurable options for CSS coverage.
 * @public
 */
export interface CSSCoverageOptions {
  /**
   * Whether to reset coverage on every navigation.
   */
  resetOnNavigation?: boolean;
}

interface Coverage {
  /**
   * @param options - Set of configurable options for coverage defaults to
   * `resetOnNavigation : true, reportAnonymousScripts : false,`
   * `includeRawScriptCoverage : false, useBlockCoverage : true`
   * @returns Promise that resolves when coverage is started.
   *
   * @remarks
   * Anonymous scripts are ones that don't have an associated url. These are
   * scripts that are dynamically created on the page using `eval` or
   * `new Function`. If `reportAnonymousScripts` is set to `true`, anonymous
   * scripts URL will start with `debugger://VM` (unless a magic //# sourceURL
   * comment is present, in which case that will the be URL).
   */
  startJSCoverage(options: JSCoverageOptions): Promise<void>;

  /**
   * Promise that resolves to the array of coverage reports for
   * all scripts.
   *
   * @remarks
   * JavaScript Coverage doesn't include anonymous scripts by default.
   * However, scripts with sourceURLs are reported.
   */
  stopJSCoverage(): Promise<JSCoverageEntry[]>;

  /**
   * @param options - Set of configurable options for coverage, defaults to
   * `resetOnNavigation : true`
   * @returns Promise that resolves when coverage is started.
   */
  startCSSCoverage(options: CSSCoverageOptions): Promise<void>;

  /**
   * Promise that resolves to the array of coverage reports
   * for all stylesheets.
   *
   * @remarks
   * CSS Coverage doesn't include dynamically injected style tags
   * without sourceURLs.
   */
  stopCSSCoverage(): Promise<CoverageEntry[]>;
}

/**
 * @public
 */
export interface TracingOptions {
  path?: string;
  screenshots?: boolean;
  categories?: string[];
}

interface Tracing {
  /**
   * Starts a trace for the current page.
   * @remarks
   * Only one trace can be active at a time per browser.
   *
   * @param options - Optional `TracingOptions`.
   */
  start(options: TracingOptions): Promise<void>;

  /**
   * Stops a trace started with the `start` method.
   * @returns Promise which resolves to buffer with trace data.
   */
  stop(): Promise<Buffer | undefined>;
}

/**
 * Represents a Node and the properties of it that are relevant to Accessibility.
 * @public
 */
export interface SerializedAXNode {
  /**
   * The {@link https://www.w3.org/TR/wai-aria/#usage_intro | role} of the node.
   */
  role: string;
  /**
   * A human readable name for the node.
   */
  name?: string;
  /**
   * The current value of the node.
   */
  value?: string | number;
  /**
   * An additional human readable description of the node.
   */
  description?: string;
  /**
   * Any keyboard shortcuts associated with this node.
   */
  keyshortcuts?: string;
  /**
   * A human readable alternative to the role.
   */
  roledescription?: string;
  /**
   * A description of the current value.
   */
  valuetext?: string;
  disabled?: boolean;
  expanded?: boolean;
  focused?: boolean;
  modal?: boolean;
  multiline?: boolean;
  /**
   * Whether more than one child can be selected.
   */
  multiselectable?: boolean;
  readonly?: boolean;
  required?: boolean;
  selected?: boolean;
  /**
   * Whether the checkbox is checked, or in a
   * {@link https://www.w3.org/TR/wai-aria-practices/examples/checkbox/checkbox-2/checkbox-2.html | mixed state}.
   */
  checked?: boolean | 'mixed';
  /**
   * Whether the node is checked or in a mixed state.
   */
  pressed?: boolean | 'mixed';
  /**
   * The level of a heading.
   */
  level?: number;
  valuemin?: number;
  valuemax?: number;
  autocomplete?: string;
  haspopup?: string;
  /**
   * Whether and in what way this node's value is invalid.
   */
  invalid?: string;
  orientation?: string;
  /**
   * Children of this node, if there are any.
   */
  children?: SerializedAXNode[];
}

/**
 * @public
 */
export interface SnapshotOptions {
  /**
   * Prune uninteresting nodes from the tree.
   * @defaultValue `true`
   */
  interestingOnly?: boolean;
  /**
   * Root node to get the accessibility tree for
   * @defaultValue The root node of the entire page.
   */
  root?: ElementHandle<Node>;
}

interface Accessibility {
  /**
   * Captures the current state of the accessibility tree.
   * The returned object represents the root accessible node of the page.
   *
   * @remarks
   *
   * **NOTE** The Chrome accessibility tree contains nodes that go unused on
   * most platforms and by most screen readers. Puppeteer will discard them as
   * well for an easier to process tree, unless `interestingOnly` is set to
   * `false`.
   *
   * @example
   * An example of dumping the entire accessibility tree:
   *
   * ```ts
   * const snapshot = await page.accessibility.snapshot();
   * console.log(snapshot);
   * ```
   *
   * @example
   * An example of logging the focused node's name:
   *
   * ```ts
   * const snapshot = await page.accessibility.snapshot();
   * const node = findFocusedNode(snapshot);
   * console.log(node && node.name);
   *
   * function findFocusedNode(node) {
   *   if (node.focused) return node;
   *   for (const child of node.children || []) {
   *     const foundNode = findFocusedNode(child);
   *     return foundNode;
   *   }
   *   return null;
   * }
   * ```
   *
   * @returns An AXNode object representing the snapshot.
   */
  snapshot(
      options: SnapshotOptions
  ): Promise<SerializedAXNode | null>;
}

/**
 * @public
 */
export interface MouseOptions {
  /**
   * Determines which button will be pressed.
   *
   * @defaultValue `'left'`
   */
  button?: MouseButton;
  /**
   * Determines the click count for the mouse event. This does not perform
   * multiple clicks.
   *
   * @deprecated Use {@link MouseClickOptions.count}.
   * @defaultValue `1`
   */
  clickCount?: number;
}

/**
 * @public
 */
export interface MouseClickOptions extends MouseOptions {
  /**
   * Time (in ms) to delay the mouse release after the mouse press.
   */
  delay?: number;
  /**
   * Number of clicks to perform.
   *
   * @defaultValue `1`
   */
  count?: number;
}

/**
 * @public
 */
export interface MouseWheelOptions {
  deltaX?: number;
  deltaY?: number;
}

/**
 * @public
 */
export interface MouseMoveOptions {
  /**
   * Determines the number of movements to make from the current mouse position
   * to the new one.
   *
   * @defaultValue `1`
   */
  steps?: number;
}

/**
 * Enum of valid mouse buttons.
 *
 * @public
 */
export type MouseButton = Readonly<{
  Left: 'left';
  Right: 'right';
  Middle: 'middle';
  Back: 'back';
  Forward: 'forward';
}>;

/**
 * @public
 */
export type Quad = [Point, Point, Point, Point];

/**
 * @public
 */
export interface BoxModel {
  content: Quad;
  padding: Quad;
  border: Quad;
  margin: Quad;
  width: number;
  height: number;
}

/**
 * @public
 */
export interface BoundingBox extends Point {
  /**
   * the width of the element in pixels.
   */
  width: number;
  /**
   * the height of the element in pixels.
   */
  height: number;
}

/**
 * @public
 */
export interface Offset {
  /**
   * x-offset for the clickable point relative to the top-left corner of the border box.
   */
  x: number;
  /**
   * y-offset for the clickable point relative to the top-left corner of the border box.
   */
  y: number;
}

/**
 * @public
 */
export interface ClickOptions extends MouseClickOptions {
  /**
   * Offset for the clickable point relative to the top-left corner of the border box.
   */
  offset?: Offset;
}

/**
 * @public
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * @public
 */
export interface ElementScreenshotOptions extends ScreenshotOptions {
  /**
   * @defaultValue `true`
   */
  scrollIntoView?: boolean;
}

/**
 * Page object which a script runs on. Provides an abstraction of
 * handling the page, such as navigation and information grabbing.
 *
 * This interface is generated from Puppeteer's `Page` class.
 */
interface Mouse {
  reset(): Promise<void>;

  move(
      x: number,
      y: number,
      options?: Readonly<MouseMoveOptions>
  ): Promise<void>;

  down(options?: Readonly<MouseOptions>): Promise<void>;

  up(options?: Readonly<MouseOptions>): Promise<void>;

  click(
      x: number,
      y: number,
      options?: Readonly<MouseClickOptions>
  ): Promise<void>;

  wheel(options?: Readonly<MouseWheelOptions>): Promise<void>;

  drag(start: Point, target: Point): Promise<any>;

  dragEnter(
      target: Point,
      data: any
  ): Promise<void>;

  dragOver(
      target: Point,
      data: any
  ): Promise<void>;

  drop(target: Point, data: any): Promise<void>;

  dragAndDrop(
      start: Point,
      target: Point,
      options?: { delay?: number }
  ): Promise<void>;
}

/**
 * @public
 */
export interface Metrics {
  Timestamp?: number;
  Documents?: number;
  Frames?: number;
  JSEventListeners?: number;
  Nodes?: number;
  LayoutCount?: number;
  RecalcStyleCount?: number;
  LayoutDuration?: number;
  RecalcStyleDuration?: number;
  ScriptDuration?: number;
  TaskDuration?: number;
  JSHeapUsedSize?: number;
  JSHeapTotalSize?: number;
}

/**
 * @public
 */
export interface Credentials {
  username: string;
  password: string;
}

/**
 * @public
 */
export interface WaitForNetworkIdleOptions extends WaitTimeoutOptions {
  /**
   * Time (in milliseconds) the network should be idle.
   *
   * @defaultValue `500`
   */
  idleTime?: number;
  /**
   * Maximum number concurrent of network connections to be considered inactive.
   *
   * @defaultValue `0`
   */
  concurrency?: number;
}

/**
 * @public
 */
export interface WaitTimeoutOptions {
  /**
   * Maximum wait time in milliseconds. Pass 0 to disable the timeout.
   *
   * The default value can be changed by using the
   * {@link Page.setDefaultTimeout} method.
   *
   * @defaultValue `30000`
   */
  timeout?: number;
}

/**
 * @public
 */
export interface WaitForSelectorOptions {
  /**
   * Wait for the selected element to be present in DOM and to be visible, i.e.
   * to not have `display: none` or `visibility: hidden` CSS properties.
   *
   * @defaultValue `false`
   */
  visible?: boolean;
  /**
   * Wait for the selected element to not be found in the DOM or to be hidden,
   * i.e. have `display: none` or `visibility: hidden` CSS properties.
   *
   * @defaultValue `false`
   */
  hidden?: boolean;
  /**
   * Maximum time to wait in milliseconds. Pass `0` to disable timeout.
   *
   * The default value can be changed by using {@link Page.setDefaultTimeout}
   *
   * @defaultValue `30_000` (30 seconds)
   */
  timeout?: number;
  /**
   * A signal object that allows you to cancel a waitForSelector call.
   */
  signal?: AbortSignal;
}

/**
 * @public
 */
export interface GeolocationOptions {
  /**
   * Latitude between `-90` and `90`.
   */
  longitude: number;
  /**
   * Longitude between `-180` and `180`.
   */
  latitude: number;
  /**
   * Optional non-negative accuracy value.
   */
  accuracy?: number;
}

/**
 * @public
 */
export interface MediaFeature {
  name: string;
  value: string;
}

/**
 * @public
 */
export interface ScreenshotClip extends BoundingBox {
  /**
   * @defaultValue `1`
   */
  scale?: number;
}

/**
 * @public
 */
export interface ScreenshotOptions {
  /**
   * @defaultValue `false`
   */
  optimizeForSpeed?: boolean;
  /**
   * @defaultValue `'png'`
   */
  type?: 'png' | 'jpeg' | 'webp';
  /**
   * Quality of the image, between 0-100. Not applicable to `png` images.
   */
  quality?: number;
  /**
   * Capture the screenshot from the surface, rather than the view.
   *
   * @defaultValue `true`
   */
  fromSurface?: boolean;
  /**
   * When `true`, takes a screenshot of the full page.
   *
   * @defaultValue `false`
   */
  fullPage?: boolean;
  /**
   * Hides default white background and allows capturing screenshots with transparency.
   *
   * @defaultValue `false`
   */
  omitBackground?: boolean;
  /**
   * The file path to save the image to. The screenshot type will be inferred
   * from file extension. If path is a relative path, then it is resolved
   * relative to current working directory. If no path is provided, the image
   * won't be saved to the disk.
   */
  path?: string;
  /**
   * Specifies the region of the page/element to clip.
   */
  clip?: ScreenshotClip;
  /**
   * Encoding of the image.
   *
   * @defaultValue `'binary'`
   */
  encoding?: 'base64' | 'binary';
  /**
   * Capture the screenshot beyond the viewport.
   *
   * @defaultValue `false` if there is no `clip`. `true` otherwise.
   */
  captureBeyondViewport?: boolean;
}

/**
 * @public
 * @experimental
 */
export interface ScreencastOptions {
  /**
   * File path to save the screencast to.
   */
  path?: `${string}.webm`;
  /**
   * Specifies the region of the viewport to crop.
   */
  crop?: BoundingBox;
  /**
   * Scales the output video.
   *
   * For example, `0.5` will shrink the width and height of the output video by
   * half. `2` will double the width and height of the output video.
   *
   * @defaultValue `1`
   */
  scale?: number;
  /**
   * Specifies the speed to record at.
   *
   * For example, `0.5` will slowdown the output video by 50%. `2` will double the
   * speed of the output video.
   *
   * @defaultValue `1`
   */
  speed?: number;
  /**
   * Path to the [ffmpeg](https://ffmpeg.org/).
   *
   * Required if `ffmpeg` is not in your PATH.
   */
  ffmpegPath?: string;
}

interface FileChooser {
  /**
   * Whether file chooser allow for
   * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-multiple | multiple}
   * file selection.
   */
  isMultiple(): boolean;

  /**
   * Accept the file chooser request with the given file paths.
   *
   * @remarks This will not validate whether the file paths exists. Also, if a
   * path is relative, then it is resolved against the
   * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
   * For locals script connecting to remote chrome environments, paths must be
   * absolute.
   */
  accept(paths: string[]): Promise<void>;

  /**
   * Closes the file chooser without selecting any files.
   */
  cancel(): Promise<void>;
}

/**
 * @public
 */
export enum TargetType {
  PAGE = 'page',
  BACKGROUND_PAGE = 'background_page',
  SERVICE_WORKER = 'service_worker',
  SHARED_WORKER = 'shared_worker',
  BROWSER = 'browser',
  WEBVIEW = 'webview',
  OTHER = 'other',
  /**
   * @internal
   */
  TAB = 'tab',
}

/**
 * @public
 */
export interface CommandOptions {
  timeout: number;
}

interface CDPSession {
  connection(): any | undefined;

  send<T>(
      method: T,
      params?: any,
      options?: CommandOptions
  ): Promise<any>;

  detach(): Promise<void>;

  id(): string;
}

interface Target {
  /**
   * If the target is not of type `"service_worker"` or `"shared_worker"`, returns `null`.
   */
  worker(): Promise<WebWorker | null>;

  /**
   * If the target is not of type `"page"`, `"webview"` or `"background_page"`,
   * returns `null`.
   */
  page(): Promise<Page | null>;

  asPage(): Promise<Page>;

  url(): string;

  createCDPSession(): Promise<CDPSession>;

  type(): TargetType;

  browser(): Browser;

  browserContext(): BrowserContext;

  opener(): Target | undefined;
}

/**
 * @public
 */
export interface BrowserContextOptions {
  /**
   * Proxy server with optional port to use for all requests.
   * Username and password can be set in `Page.authenticate`.
   */
  proxyServer?: string;
  /**
   * Bypass the proxy for the given list of hosts.
   */
  proxyBypassList?: string[];
}

/**
 * @public
 */
export type Permission =
    | 'geolocation'
    | 'midi'
    | 'notifications'
    | 'camera'
    | 'microphone'
    | 'background-sync'
    | 'ambient-light-sensor'
    | 'accelerometer'
    | 'gyroscope'
    | 'magnetometer'
    | 'accessibility-events'
    | 'clipboard-read'
    | 'clipboard-write'
    | 'clipboard-sanitized-write'
    | 'payment-handler'
    | 'persistent-storage'
    | 'idle-detection'
    | 'midi-sysex';

/**
 * @public
 */
export interface WaitForTargetOptions {
  /**
   * Maximum wait time in milliseconds. Pass `0` to disable the timeout.
   *
   * @defaultValue `30_000`
   */
  timeout?: number;
}

/**
 * @public
 */
export type EventType = string | symbol;

/**
 * All the events a {@link Browser | browser instance} may emit.
 *
 * @public
 */
export const enum BrowserEvent {
  /**
   * Emitted when Puppeteer gets disconnected from the browser instance. This
   * might happen because either:
   *
   * - The browser closes/crashes or
   * - {@link Browser.disconnect} was called.
   */
  Disconnected = 'disconnected',
  /**
   * Emitted when the URL of a target changes. Contains a {@link Target}
   * instance.
   *
   * @remarks Note that this includes target changes in all browser
   * contexts.
   */
  TargetChanged = 'targetchanged',
  /**
   * Emitted when a target is created, for example when a new page is opened by
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/open | window.open}
   * or by {@link Browser.newPage | browser.newPage}
   *
   * Contains a {@link Target} instance.
   *
   * @remarks Note that this includes target creations in all browser
   * contexts.
   */
  TargetCreated = 'targetcreated',
  /**
   * Emitted when a target is destroyed, for example when a page is closed.
   * Contains a {@link Target} instance.
   *
   * @remarks Note that this includes target destructions in all browser
   * contexts.
   */
  TargetDestroyed = 'targetdestroyed',
  /**
   * @internal
   */
  TargetDiscovered = 'targetdiscovered',
}

/**
 * @public
 */
export interface BrowserEvents extends Record<EventType, unknown> {
  [BrowserEvent.Disconnected]: undefined;
  [BrowserEvent.TargetCreated]: Target;
  [BrowserEvent.TargetDestroyed]: Target;
  [BrowserEvent.TargetChanged]: Target;
}

/**
 * @public
 * @experimental
 */
export interface DebugInfo {
  pendingProtocolErrors: Error[];
}

interface BrowserContext {
  targets(): Target[];

  /**
   * Waits until a {@link Target | target} matching the given `predicate`
   * appears and returns it.
   *
   * This will look all open {@link BrowserContext | browser contexts}.
   *
   * @example Finding a target for a page opened via `window.open`:
   *
   * ```ts
   * await page.evaluate(() => window.open('https://www.example.com/'));
   * const newWindowTarget = await browserContext.waitForTarget(
   *   target => target.url() === 'https://www.example.com/'
   * );
   * ```
   */
  waitForTarget(
      predicate: (x: Target) => boolean | Promise<boolean>,
      options: WaitForTargetOptions
  ): Promise<Target>;

  pages(): Promise<Page[]>;

  isIncognito(): boolean;

  overridePermissions(
      origin: string,
      permissions: Permission[]
  ): Promise<void>;

  clearPermissionOverrides(): Promise<void>;

  newPage(): Promise<Page>;

  browser(): Browser;

  close(): Promise<void>;
}

export interface Browser {
  process(): any | null;

  createBrowserContext(
      options?: BrowserContextOptions
  ): Promise<BrowserContext>;

  browserContexts(): BrowserContext[];

  defaultBrowserContext(): BrowserContext;

  wsEndpoint(): string;

  newPage(): Promise<Page>;

  targets(): Target[];

  target(): Target;

  /**
   * Waits until a {@link Target | target} matching the given `predicate`
   * appears and returns it.
   *
   * This will look all open {@link BrowserContext | browser contexts}.
   *
   * @example Finding a target for a page opened via `window.open`:
   *
   * ```ts
   * await page.evaluate(() => window.open('https://www.example.com/'));
   * const newWindowTarget = await browser.waitForTarget(
   *   target => target.url() === 'https://www.example.com/'
   * );
   * ```
   */
  waitForTarget(
      predicate: (x: Target) => boolean | Promise<boolean>,
      options: WaitForTargetOptions
  ): Promise<Target>;

  /**
   * Gets a list of all open {@link Page | pages} inside this {@link Browser}.
   *
   * If there ar multiple {@link BrowserContext | browser contexts}, this
   * returns all {@link Page | pages} in all
   * {@link BrowserContext | browser contexts}.
   *
   * @remarks Non-visible {@link Page | pages}, such as `"background_page"`,
   * will not be listed here. You can find them using {@link Target.page}.
   */
  pages(): Promise<Page[]>;

  version(): Promise<string>;

  userAgent(): Promise<string>;

  close(): Promise<void>;

  disconnect(): Promise<void>;

  /**
   * Whether Puppeteer is connected to this {@link Browser | browser}.
   *
   * @deprecated Use {@link Browser | Browser.connected}.
   */
  isConnected(): boolean;
}

export type PuppeteerLifeCycleEvent =
/**
 * Waits for the 'load' event.
 */
    | 'load'
    /**
     * Waits for the 'DOMContentLoaded' event.
     */
    | 'domcontentloaded'
    /**
     * Waits till there are no more than 0 network connections for at least `500`
     * ms.
     */
    | 'networkidle0'
    /**
     * Waits till there are no more than 2 network connections for at least `500`
     * ms.
     */
    | 'networkidle2';

/**
 * @public
 */
export interface WaitForOptions {
  /**
   * Maximum wait time in milliseconds. Pass 0 to disable the timeout.
   *
   * The default value can be changed by using the
   * {@link Page.setDefaultTimeout} or {@link Page.setDefaultNavigationTimeout}
   * methods.
   *
   * @defaultValue `30000`
   */
  timeout?: number;
  /**
   * When to consider waiting succeeds. Given an array of event strings, waiting
   * is considered to be successful after all events have been fired.
   *
   * @defaultValue `'load'`
   */
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
  /**
   * @internal
   */
  ignoreSameDocumentNavigation?: boolean;
}

/**
 * @public
 */
export interface GoToOptions extends WaitForOptions {
  /**
   * If provided, it will take preference over the referer header value set by
   * {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
   */
  referer?: string;
  /**
   * If provided, it will take preference over the referer-policy header value
   * set by {@link Page.setExtraHTTPHeaders | page.setExtraHTTPHeaders()}.
   */
  referrerPolicy?: string;
}

/**
 * @public
 */
export interface FrameWaitForFunctionOptions {
  /**
   * An interval at which the `pageFunction` is executed, defaults to `raf`. If
   * `polling` is a number, then it is treated as an interval in milliseconds at
   * which the function would be executed. If `polling` is a string, then it can
   * be one of the following values:
   *
   * - `raf` - to constantly execute `pageFunction` in `requestAnimationFrame`
   *   callback. This is the tightest polling mode which is suitable to observe
   *   styling changes.
   *
   * - `mutation` - to execute `pageFunction` on every DOM mutation.
   */
  polling?: 'raf' | 'mutation' | number;
  /**
   * Maximum time to wait in milliseconds. Defaults to `30000` (30 seconds).
   * Pass `0` to disable the timeout. Puppeteer's default timeout can be changed
   * using {@link Page.setDefaultTimeout}.
   */
  timeout?: number;
  /**
   * A signal object that allows you to cancel a waitForFunction call.
   */
  signal?: AbortSignal;
}

/**
 * @public
 */
export interface FrameAddScriptTagOptions {
  /**
   * URL of the script to be added.
   */
  url?: string;
  /**
   * Path to a JavaScript file to be injected into the frame.
   *
   * @remarks
   * If `path` is a relative path, it is resolved relative to the current
   * working directory (`process.cwd()` in Node.js).
   */
  path?: string;
  /**
   * JavaScript to be injected into the frame.
   */
  content?: string;
  /**
   * Sets the `type` of the script. Use `module` in order to load an ES2015 module.
   */
  type?: string;
  /**
   * Sets the `id` of the script.
   */
  id?: string;
}

/**
 * @public
 */
export interface FrameAddStyleTagOptions {
  /**
   * the URL of the CSS file to be added.
   */
  url?: string;
  /**
   * The path to a CSS file to be injected into the frame.
   * @remarks
   * If `path` is a relative path, it is resolved relative to the current
   * working directory (`process.cwd()` in Node.js).
   */
  path?: string;
  /**
   * Raw CSS content to be injected into the frame.
   */
  content?: string;
}

interface Frame {
  page(): Page;

  isOOPFrame(): boolean;

  goto(
      url: string,
      options?: GoToOptions
  ): Promise<HTTPResponse | null>;

  waitForNavigation(
      options?: WaitForOptions
  ): Promise<HTTPResponse | null>;

  /**
   * @returns The frame element associated with this frame (if any).
   */
  frameElement(): Promise<HandleFor<HTMLIFrameElement> | null>;

  /**
   * Behaves identically to {@link Page.evaluateHandle} except it's run within
   * the context of this frame.
   *
   * @see {@link Page.evaluateHandle} for details.
   */
  evaluateHandle<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  /**
   * Behaves identically to {@link Page.evaluate} except it's run within
   * the context of this frame.
   *
   * @see {@link Page.evaluate} for details.
   */
  evaluate<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Creates a locator for the provided selector. See {@link Locator} for
   * details and supported actions.
   *
   * @remarks
   * Locators API is experimental and we will not follow semver for breaking
   * change in the Locators API.
   */
  locator<Selector extends string>(
      selector: Selector
  ): Locator<NodeFor<Selector>>;

  /**
   * Creates a locator for the provided function. See {@link Locator} for
   * details and supported actions.
   *
   * @remarks
   * Locators API is experimental and we will not follow semver for breaking
   * change in the Locators API.
   */
  locator<Ret>(func: () => Awaitable<Ret>): Locator<Ret>;

  /**
   * @internal
   */
  locator<Selector extends string, Ret>(
      selectorOrFunc: Selector | ( () => Awaitable<Ret> )
  ): Locator<NodeFor<Selector>> | Locator<Ret>;

  /**
   * Queries the frame for an element matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns A {@link ElementHandle | element handle} to the first element
   * matching the given selector. Otherwise, `null`.
   */
  $<Selector extends string>(
      selector: Selector
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * Queries the frame for all elements matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns An array of {@link ElementHandle | element handles} that point to
   * elements matching the given selector.
   */
  $$<Selector extends string>(
      selector: Selector
  ): Promise<Array<ElementHandle<NodeFor<Selector>>>>;

  /**
   * Runs the given function on the first element matching the given selector in
   * the frame.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   *
   * ```ts
   * const searchValue = await frame.$eval('#search', el => el.value);
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in the frame's context.
   * The first element matching the selector will be passed to the function as
   * its first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  $eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<NodeFor<Selector>, Params> = EvaluateFuncWith<
          NodeFor<Selector>,
          Params
      >,
  >(
      selector: Selector,
      pageFunction: string | Func,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Runs the given function on an array of elements matching the given selector
   * in the frame.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   *
   * ```ts
   * const divsCounts = await frame.$$eval('div', divs => divs.length);
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in the frame's context.
   * An array of elements matching the given selector will be passed to the
   * function as its first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  $$eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<
          Array<NodeFor<Selector>>,
          Params
      > = EvaluateFuncWith<Array<NodeFor<Selector>>, Params>,
  >(
      selector: Selector,
      pageFunction: string | Func,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Waits for an element matching the given selector to appear in the frame.
   *
   * This method works across navigations.
   *
   * @example
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   *
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   let currentURL;
   *   page
   *     .mainFrame()
   *     .waitForSelector('img')
   *     .then(() => console.log('First URL with image: ' + currentURL));
   *
   *   for (currentURL of [
   *     'https://example.com',
   *     'https://google.com',
   *     'https://bbc.com',
   *   ]) {
   *     await page.goto(currentURL);
   *   }
   *   await browser.close();
   * })();
   * ```
   *
   * @param selector - The selector to query and wait for.
   * @param options - Options for customizing waiting behavior.
   * @returns An element matching the given selector.
   * @throws Throws if an element matching the given selector doesn't appear.
   */
  waitForSelector<Selector extends string>(
      selector: Selector,
      options: WaitForSelectorOptions
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * @example
   * The `waitForFunction` can be used to observe viewport size change:
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   *
   * (async () => {
   * .  const browser = await puppeteer.launch();
   * .  const page = await browser.newPage();
   * .  const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
   * .  page.setViewport({width: 50, height: 50});
   * .  await watchDog;
   * .  await browser.close();
   * })();
   * ```
   *
   * To pass arguments from Node.js to the predicate of `page.waitForFunction` function:
   *
   * ```ts
   * const selector = '.foo';
   * await frame.waitForFunction(
   *   selector => !!document.querySelector(selector),
   *   {}, // empty options object
   *   selector
   * );
   * ```
   *
   * @param pageFunction - the function to evaluate in the frame context.
   * @param options - options to configure the polling method and timeout.
   * @param args - arguments to pass to the `pageFunction`.
   * @returns the promise which resolve when the `pageFunction` returns a truthy value.
   */
  waitForFunction<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      options: FrameWaitForFunctionOptions,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  /**
   * The full HTML contents of the frame, including the DOCTYPE.
   */
  content(): Promise<string>;

  setContent(html: string, options?: WaitForOptions): Promise<void>;

  /**
   * @internal
   */
  setFrameContent(content: string): Promise<void>;

  /**
   * The frame's `name` attribute as specified in the tag.
   *
   * @remarks
   * If the name is empty, it returns the `id` attribute instead.
   *
   * @remarks
   * This value is calculated once when the frame is created, and will not
   * update if the attribute is changed later.
   *
   * @deprecated Use
   *
   * ```ts
   * const element = await frame.frameElement();
   * const nameOrId = await element.evaluate(frame => frame.name ?? frame.id);
   * ```
   */
  name(): string;

  url(): string;

  parentFrame(): Frame | null;

  childFrames(): Frame[];

  /**
   * Is`true` if the frame has been detached. Otherwise, `false`.
   *
   * @deprecated Use the `detached` getter.
   */
  isDetached(): boolean;

  /**
   * Adds a `<script>` tag into the page with the desired url or content.
   *
   * @param options - Options for the script.
   * @returns An {@link ElementHandle | element handle} to the injected
   * `<script>` element.
   */
  addScriptTag(
      options: FrameAddScriptTagOptions
  ): Promise<ElementHandle<HTMLScriptElement>>;

  /**
   * Adds a `HTMLStyleElement` into the frame with the desired URL
   *
   * @returns An {@link ElementHandle | element handle} to the loaded `<style>`
   * element.
   */
  addStyleTag(
      options: Omit<FrameAddStyleTagOptions, 'url'>
  ): Promise<ElementHandle<HTMLStyleElement>>;

  /**
   * Adds a `HTMLLinkElement` into the frame with the desired URL
   *
   * @returns An {@link ElementHandle | element handle} to the loaded `<link>`
   * element.
   */
  addStyleTag(
      options: FrameAddStyleTagOptions
  ): Promise<ElementHandle<HTMLLinkElement>>;

  /**
   * @internal
   */
  addStyleTag(
      options: FrameAddStyleTagOptions
  ): Promise<ElementHandle<HTMLStyleElement | HTMLLinkElement>>;

  /**
   * Clicks the first element found that matches `selector`.
   *
   * @remarks
   * If `click()` triggers a navigation event and there's a separate
   * `page.waitForNavigation()` promise to be resolved, you may end up with a
   * race condition that yields unexpected results. The correct pattern for
   * click and wait for navigation is the following:
   *
   * ```ts
   * const [response] = await Promise.all([
   *   page.waitForNavigation(waitOptions),
   *   frame.click(selector, clickOptions),
   * ]);
   * ```
   *
   * @param selector - The selector to query for.
   */
  click(
      selector: string,
      options: Readonly<ClickOptions>
  ): Promise<void>;

  /**
   * Focuses the first element that matches the `selector`.
   *
   * @param selector - The selector to query for.
   * @throws Throws if there's no element matching `selector`.
   */
  focus(selector: string): Promise<void>;

  /**
   * Hovers the pointer over the center of the first element that matches the
   * `selector`.
   *
   * @param selector - The selector to query for.
   * @throws Throws if there's no element matching `selector`.
   */
  hover(selector: string): Promise<void>;

  /**
   * Selects a set of value on the first `<select>` element that matches the
   * `selector`.
   *
   * @example
   *
   * ```ts
   * frame.select('select#colors', 'blue'); // single selection
   * frame.select('select#colors', 'red', 'green', 'blue'); // multiple selections
   * ```
   *
   * @param selector - The selector to query for.
   * @param values - The array of values to select. If the `<select>` has the
   * `multiple` attribute, all values are considered, otherwise only the first
   * one is taken into account.
   * @returns the list of values that were successfully selected.
   * @throws Throws if there's no `<select>` matching `selector`.
   */
  select(selector: string, ...values: string[]): Promise<string[]>;

  /**
   * Taps the first element that matches the `selector`.
   *
   * @param selector - The selector to query for.
   * @throws Throws if there's no element matching `selector`.
   */
  tap(selector: string): Promise<void>;

  /**
   * Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character
   * in the text.
   *
   * @remarks
   * To press a special key, like `Control` or `ArrowDown`, use
   * {@link Keyboard.press}.
   *
   * @example
   *
   * ```ts
   * await frame.type('#mytextarea', 'Hello'); // Types instantly
   * await frame.type('#mytextarea', 'World', {delay: 100}); // Types slower, like a user
   * ```
   *
   * @param selector - the selector for the element to type into. If there are
   * multiple the first will be used.
   * @param text - text to type into the element
   * @param options - takes one option, `delay`, which sets the time to wait
   * between key presses in milliseconds. Defaults to `0`.
   */
  type(
      selector: string,
      text: string,
      options?: Readonly<KeyboardTypeOptions>
  ): Promise<void>;

  /**
   * The frame's title.
   */
  title(): Promise<string>;

  waitForDevicePrompt(
      options?: WaitTimeoutOptions
  ): Promise<DeviceRequestPrompt>;
}

interface WebWorker {
  /**
   * The URL of this web worker.
   */
  url(): string;

  /**
   * Evaluates a given function in the {@link WebWorker | worker}.
   *
   * @remarks If the given function returns a promise,
   * {@link WebWorker.evaluate | evaluate} will wait for the promise to resolve.
   *
   * As a rule of thumb, if the return value of the given function is more
   * complicated than a JSON object (e.g. most classes), then
   * {@link WebWorker.evaluate | evaluate} will _likely_ return some truncated
   * value (or `{}`). This is because we are not returning the actual return
   * value, but a deserialized version as a result of transferring the return
   * value through a protocol to Puppeteer.
   *
   * In general, you should use
   * {@link WebWorker.evaluateHandle | evaluateHandle} if
   * {@link WebWorker.evaluate | evaluate} cannot serialize the return value
   * properly or you need a mutable {@link JSHandle | handle} to the return
   * object.
   *
   * @param func - Function to be evaluated.
   * @param args - Arguments to pass into `func`.
   * @returns The result of `func`.
   */
  evaluate<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(func: Func | string, ...args: Params): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Evaluates a given function in the {@link WebWorker | worker}.
   *
   * @remarks If the given function returns a promise,
   * {@link WebWorker.evaluate | evaluate} will wait for the promise to resolve.
   *
   * In general, you should use
   * {@link WebWorker.evaluateHandle | evaluateHandle} if
   * {@link WebWorker.evaluate | evaluate} cannot serialize the return value
   * properly or you need a mutable {@link JSHandle | handle} to the return
   * object.
   *
   * @param func - Function to be evaluated.
   * @param args - Arguments to pass into `func`.
   * @returns A {@link JSHandle | handle} to the return value of `func`.
   */
  evaluateHandle<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      func: Func | string,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  close(): Promise<void>;
}

/**
 * @public
 */
export interface NetworkConditions {
  /**
   * Download speed (bytes/s)
   */
  download: number;
  /**
   * Upload speed (bytes/s)
   */
  upload: number;
  /**
   * Latency (ms)
   */
  latency: number;
}

/**
 * @public
 */
export interface InternalNetworkConditions extends NetworkConditions {
  offline: boolean;
}

/**
 * @public
 */
export type VisibilityOption = 'hidden' | 'visible' | null;

/**
 * @public
 */
export interface LocatorOptions {
  /**
   * Whether to wait for the element to be `visible` or `hidden`. `null` to
   * disable visibility checks.
   */
  visibility: VisibilityOption;
  /**
   * Total timeout for the entire locator operation.
   *
   * Pass `0` to disable timeout.
   *
   * @defaultValue `Page.getDefaultTimeout()`
   */
  timeout: number;
  /**
   * Whether to scroll the element into viewport if not in the viewprot already.
   * @defaultValue `true`
   */
  ensureElementIsInTheViewport: boolean;
  /**
   * Whether to wait for input elements to become enabled before the action.
   * Applicable to `click` and `fill` actions.
   * @defaultValue `true`
   */
  waitForEnabled: boolean;
  /**
   * Whether to wait for the element's bounding box to be same between two
   * animation frames.
   * @defaultValue `true`
   */
  waitForStableBoundingBox: boolean;
}

/**
 * @public
 */
export interface ActionOptions {
  signal?: AbortSignal;
}

/**
 * @public
 */
export type LocatorClickOptions = ClickOptions & ActionOptions;

/**
 * @public
 */
export interface LocatorScrollOptions extends ActionOptions {
  scrollTop?: number;
  scrollLeft?: number;
}

/**
 * @public
 */
export type Mapper<From, To> = (value: From) => Awaitable<To>;

/**
 * @public
 */
export type Predicate<From, To extends From = From> =
    | ( (value: From) => value is To )
    | ( (value: From) => Awaitable<boolean> );

/**
 * @public
 */
export type AwaitablePredicate<T> = (value: T) => Awaitable<boolean>;

/**
 * @public
 */
export interface Moveable {
  /**
   * Moves the resource when 'using'.
   */
  move(): this;
}

/**
 * @public
 */
export type AwaitableIterable<T> = Iterable<T> | AsyncIterable<T>;

/**
 * @public
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * @public
 */
export type HandleFor<T> = T extends Node ? ElementHandle<T> : JSHandle<T>;

/**
 * @public
 */
export type HandleOr<T> = HandleFor<T> | JSHandle<T> | T;

/**
 * @public
 */
export type FlattenHandle<T> = T extends HandleOr<infer U> ? U : never;

/**
 * @public
 */
export type ElementFor<
    TagName extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
> = TagName extends keyof HTMLElementTagNameMap
    ? HTMLElementTagNameMap[TagName]
    : TagName extends keyof SVGElementTagNameMap
        ? SVGElementTagNameMap[TagName]
        : never;

/**
 * @public
 */
export type InnerParams<T extends unknown[]> = {
  [K in keyof T]: FlattenHandle<T[K]>;
};

/**
 * @public
 */
export type EvaluateFunc<T extends unknown[]> = (
    ...params: InnerParams<T>
) => Awaitable<unknown>;

/**
 * @public
 */
export type EvaluateFuncWith<V, T extends unknown[]> = (
    ...params: [V, ...InnerParams<T>]
) => Awaitable<unknown>;

/**
 * @public
 */
export type NodeFor<ComplexSelector extends string> =
    TypeSelectorOfComplexSelector<ComplexSelector> extends infer TypeSelector
        ? TypeSelector extends | keyof HTMLElementTagNameMap
            | keyof SVGElementTagNameMap
            ? ElementFor<TypeSelector>
            : Element
        : never;

type TypeSelectorOfComplexSelector<ComplexSelector extends string> =
    CompoundSelectorsOfComplexSelector<ComplexSelector> extends infer CompoundSelectors
        ? CompoundSelectors extends NonEmptyReadonlyArray<string>
            ? Last<CompoundSelectors> extends infer LastCompoundSelector
                ? LastCompoundSelector extends string
                    ? TypeSelectorOfCompoundSelector<LastCompoundSelector>
                    : never
                : never
            : unknown
        : never;

type TypeSelectorOfCompoundSelector<CompoundSelector extends string> =
    SplitWithDelemiters<
        CompoundSelector,
        BeginSubclassSelectorTokens
    > extends infer CompoundSelectorTokens
        ? CompoundSelectorTokens extends [infer TypeSelector, ...any[]]
            ? TypeSelector extends ''
                ? unknown
                : TypeSelector
            : never
        : never;

type Last<Arr extends NonEmptyReadonlyArray<unknown>> = Arr extends [
      infer Head,
      ...infer Tail,
    ]
    ? Tail extends NonEmptyReadonlyArray<unknown>
        ? Last<Tail>
        : Head
    : never;

type NonEmptyReadonlyArray<T> = [T, ...( readonly T[] )];

type CompoundSelectorsOfComplexSelector<ComplexSelector extends string> =
    SplitWithDelemiters<
        ComplexSelector,
        CombinatorTokens
    > extends infer IntermediateTokens
        ? IntermediateTokens extends readonly string[]
            ? Drop<IntermediateTokens, ''>
            : never
        : never;

type SplitWithDelemiters<
    Input extends string,
    Delemiters extends readonly string[],
> = Delemiters extends [infer FirstDelemiter, ...infer RestDelemiters]
    ? FirstDelemiter extends string
        ? RestDelemiters extends readonly string[]
            ? FlatmapSplitWithDelemiters<Split<Input, FirstDelemiter>, RestDelemiters>
            : never
        : never
    : [Input];

type BeginSubclassSelectorTokens = ['.', '#', '[', ':'];

type CombinatorTokens = [' ', '>', '+', '~', '|', '|'];

type Drop<
    Arr extends readonly unknown[],
    Remove,
    Acc extends unknown[] = [],
> = Arr extends [infer Head, ...infer Tail]
    ? Head extends Remove
        ? Drop<Tail, Remove>
        : Drop<Tail, Remove, [...Acc, Head]>
    : Acc;

type FlatmapSplitWithDelemiters<
    Inputs extends readonly string[],
    Delemiters extends readonly string[],
    Acc extends string[] = [],
> = Inputs extends [infer FirstInput, ...infer RestInputs]
    ? FirstInput extends string
        ? RestInputs extends readonly string[]
            ? FlatmapSplitWithDelemiters<
                RestInputs,
                Delemiters,
                [...Acc, ...SplitWithDelemiters<FirstInput, Delemiters>]
            >
            : Acc
        : Acc
    : Acc;

type Split<
    Input extends string,
    Delimiter extends string,
    Acc extends string[] = [],
> = Input extends `${infer Prefix}${Delimiter}${infer Suffix}`
    ? Split<Suffix, Delimiter, [...Acc, Prefix]>
    : [...Acc, Input];

interface Locator<T> {
  setTimeout(timeout: number): Locator<T>;

  setVisibility<NodeType extends Node>(
      this: Locator<NodeType>,
      visibility: VisibilityOption
  ): Locator<NodeType>;

  setWaitForEnabled<NodeType extends Node>(
      this: Locator<NodeType>,
      value: boolean
  ): Locator<NodeType>;

  setEnsureElementIsInTheViewport<ElementType extends Element>(
      this: Locator<ElementType>,
      value: boolean
  ): Locator<ElementType>;

  setWaitForStableBoundingBox<ElementType extends Element>(
      this: Locator<ElementType>,
      value: boolean
  ): Locator<ElementType>;

  /**
   * Waits for the locator to get a handle from the page.
   *
   * @public
   */
  waitHandle(options?: Readonly<ActionOptions>): Promise<HandleFor<T>>;

  /**
   * Waits for the locator to get the serialized value from the page.
   *
   * Note this requires the value to be JSON-serializable.
   *
   * @public
   */
  wait(options?: Readonly<ActionOptions>): Promise<T>;

  /**
   * Maps the locator using the provided mapper.
   *
   * @public
   */
  map<To>(mapper: Mapper<T, To>): Locator<To>;

  /**
   * Creates an expectation that is evaluated against located values.
   *
   * If the expectations do not match, then the locator will retry.
   *
   * @public
   */
  filter<S extends T>(predicate: Predicate<T, S>): Locator<S>;

  click<ElementType extends Element>(
      this: Locator<ElementType>,
      options?: Readonly<LocatorClickOptions>
  ): Promise<void>;

  /**
   * Fills out the input identified by the locator using the provided value. The
   * type of the input is determined at runtime and the appropriate fill-out
   * method is chosen based on the type. contenteditable, selector, inputs are
   * supported.
   */
  fill<ElementType extends Element>(
      this: Locator<ElementType>,
      value: string,
      options?: Readonly<ActionOptions>
  ): Promise<void>;

  hover<ElementType extends Element>(
      this: Locator<ElementType>,
      options?: Readonly<ActionOptions>
  ): Promise<void>;

  scroll<ElementType extends Element>(
      this: Locator<ElementType>,
      options?: Readonly<LocatorScrollOptions>
  ): Promise<void>;
}

interface JSHandle<T = unknown> {
  /**
   * Evaluates the given function with the current handle as its first argument.
   */
  evaluate<
      Params extends unknown[],
      Func extends EvaluateFuncWith<T, Params> = EvaluateFuncWith<T, Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Evaluates the given function with the current handle as its first argument.
   *
   */
  evaluateHandle<
      Params extends unknown[],
      Func extends EvaluateFuncWith<T, Params> = EvaluateFuncWith<T, Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  /**
   * Fetches a single property from the referenced object.
   */
  getProperty<K extends keyof T>(
      propertyName: HandleOr<K>
  ): Promise<HandleFor<T[K]>>;

  getProperty(propertyName: string): Promise<JSHandle<unknown>>;

  /**
   * @internal
   */
  getProperty<K extends keyof T>(
      propertyName: HandleOr<K>
  ): Promise<HandleFor<T[K]>>;

  /**
   * Gets a map of handles representing the properties of the current handle.
   *
   * @example
   *
   * ```ts
   * const listHandle = await page.evaluateHandle(() => document.body.children);
   * const properties = await listHandle.getProperties();
   * const children = [];
   * for (const property of properties.values()) {
   *   const element = property.asElement();
   *   if (element) {
   *     children.push(element);
   *   }
   * }
   * children; // holds elementHandles to all children of document.body
   * ```
   */
  getProperties(): Promise<Map<string, JSHandle>>;

  jsonValue(): Promise<T>;

  asElement(): ElementHandle<Node> | null;

  dispose(): Promise<void>;

  toString(): string;
}

/**
 * @public
 */
export interface AutofillData {
  creditCard: {
    // See https://chromedevtools.github.io/devtools-protocol/tot/Autofill/#type-CreditCard.
    number: string;
    name: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  };
}

interface ElementHandle<ElementType extends Node = Element> extends JSHandle<ElementType> {
  /**
   * Queries the current element for an element matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns A {@link ElementHandle | element handle} to the first element
   * matching the given selector. Otherwise, `null`.
   */
  $<Selector extends string>(
      selector: Selector
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * Queries the current element for all elements matching the given selector.
   *
   * @param selector - The selector to query for.
   * @returns An array of {@link ElementHandle | element handles} that point to
   * elements matching the given selector.
   */
  $$<Selector extends string>(
      selector: Selector
  ): Promise<Array<ElementHandle<NodeFor<Selector>>>>;

  /**
   * Runs the given function on the first element matching the given selector in
   * the current element.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   *
   * ```ts
   * const tweetHandle = await page.$('.tweet');
   * expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe(
   *   '100'
   * );
   * expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe(
   *   '10'
   * );
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in this element's page's
   * context. The first element matching the selector will be passed in as the
   * first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  $eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<NodeFor<Selector>, Params> = EvaluateFuncWith<
          NodeFor<Selector>,
          Params
      >,
  >(
      selector: Selector,
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Runs the given function on an array of elements matching the given selector
   * in the current element.
   *
   * If the given function returns a promise, then this method will wait till
   * the promise resolves.
   *
   * @example
   * HTML:
   *
   * ```html
   * <div class="feed">
   *   <div class="tweet">Hello!</div>
   *   <div class="tweet">Hi!</div>
   * </div>
   * ```
   *
   * JavaScript:
   *
   * ```ts
   * const feedHandle = await page.$('.feed');
   * expect(
   *   await feedHandle.$$eval('.tweet', nodes => nodes.map(n => n.innerText))
   * ).toEqual(['Hello!', 'Hi!']);
   * ```
   *
   * @param selector - The selector to query for.
   * @param pageFunction - The function to be evaluated in the element's page's
   * context. An array of elements matching the given selector will be passed to
   * the function as its first argument.
   * @param args - Additional arguments to pass to `pageFunction`.
   * @returns A promise to the result of the function.
   */
  $$eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<
          Array<NodeFor<Selector>>,
          Params
      > = EvaluateFuncWith<Array<NodeFor<Selector>>, Params>,
  >(
      selector: Selector,
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * Wait for an element matching the given selector to appear in the current
   * element.
   *
   * Unlike {@link Frame.waitForSelector}, this method does not work across
   * navigations or if the element is detached from DOM.
   *
   * @example
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   *
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   let currentURL;
   *   page
   *     .mainFrame()
   *     .waitForSelector('img')
   *     .then(() => console.log('First URL with image: ' + currentURL));
   *
   *   for (currentURL of [
   *     'https://example.com',
   *     'https://google.com',
   *     'https://bbc.com',
   *   ]) {
   *     await page.goto(currentURL);
   *   }
   *   await browser.close();
   * })();
   * ```
   *
   * @param selector - The selector to query and wait for.
   * @param options - Options for customizing waiting behavior.
   * @returns An element matching the given selector.
   * @throws Throws if an element matching the given selector doesn't appear.
   */
  waitForSelector<Selector extends string>(
      selector: Selector,
      options: WaitForSelectorOptions
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * Checks if an element is visible using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  isVisible(): Promise<boolean>;

  /**
   * Checks if an element is hidden using the same mechanism as
   * {@link ElementHandle.waitForSelector}.
   */
  isHidden(): Promise<boolean>;

  /**
   * Converts the current handle to the given element type.
   *
   * @example
   *
   * ```ts
   * const element: ElementHandle<Element> = await page.$(
   *   '.class-name-of-anchor'
   * );
   * // DO NOT DISPOSE `element`, this will be always be the same handle.
   * const anchor: ElementHandle<HTMLAnchorElement> =
   *   await element.toElement('a');
   * ```
   *
   * @param tagName - The tag name of the desired element type.
   * @throws An error if the handle does not match. **The handle will not be
   * automatically disposed.**
   */
  toElement<
      K extends keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap,
  >(tagName: K): Promise<HandleFor<ElementFor<K>>>;

  contentFrame(this: ElementHandle<HTMLIFrameElement>): Promise<Frame>;

  /**
   * Returns the middle point within an element unless a specific offset is provided.
   */
  clickablePoint(offset?: Offset): Promise<Point>;

  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page.mouse} to hover over the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  hover(this: ElementHandle<Element>): Promise<void>;

  /**
   * This method scrolls element into view if needed, and then
   * uses {@link Page.mouse} to click in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  click(
      this: ElementHandle<Element>,
      options: Readonly<ClickOptions>
  ): Promise<void>;

  /**
   * Drags an element over the given element or point.
   *
   * @returns DEPRECATED. When drag interception is enabled, the drag payload is
   * returned.
   */
  drag(
      this: ElementHandle<Element>,
      target: Point | ElementHandle<Element>
  ): Promise<any | void>;

  /**
   * @deprecated Do not use. `dragenter` will automatically be performed during dragging.
   */
  dragEnter(
      this: ElementHandle<Element>,
      data: any
  ): Promise<void>;

  /**
   * @deprecated Do not use. `dragover` will automatically be performed during dragging.
   */
  dragOver(
      this: ElementHandle<Element>,
      data: any
  ): Promise<void>;

  /**
   * Drops the given element onto the current one.
   */
  drop(
      this: ElementHandle<Element>,
      element: ElementHandle<Element>
  ): Promise<void>;

  /**
   * @deprecated No longer supported.
   */
  drop(
      this: ElementHandle<Element>,
      data?: any
  ): Promise<void>;

  /**
   * @internal
   */
  drop(
      this: ElementHandle<Element>,
      dataOrElement: ElementHandle<Element> | any
  ): Promise<void>;

  /**
   * @deprecated Use `ElementHandle.drop` instead.
   */
  dragAndDrop(
      this: ElementHandle<Element>,
      target: ElementHandle<Node>,
      options?: { delay: number }
  ): Promise<void>;

  /**
   * Triggers a `change` and `input` event once all the provided options have been
   * selected. If there's no `<select>` element matching `selector`, the method
   * throws an error.
   *
   * @example
   *
   * ```ts
   * handle.select('blue'); // single selection
   * handle.select('red', 'green', 'blue'); // multiple selections
   * ```
   *
   * @param values - Values of options to select. If the `<select>` has the
   * `multiple` attribute, all values are considered, otherwise only the first
   * one is taken into account.
   */
  select(...values: string[]): Promise<string[]>;

  uploadFile(
      this: ElementHandle<HTMLInputElement>,
      ...paths: string[]
  ): Promise<void>;

  /**
   * This method scrolls element into view if needed, and then uses
   * {@link Touchscreen.tap} to tap in the center of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  tap(this: ElementHandle<Element>): Promise<void>;

  touchStart(this: ElementHandle<Element>): Promise<void>;

  touchMove(this: ElementHandle<Element>): Promise<void>;

  touchEnd(this: ElementHandle<Element>): Promise<void>;

  /**
   * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
   */
  focus(): Promise<void>;

  /**
   * Focuses the element, and then sends a `keydown`, `keypress`/`input`, and
   * `keyup` event for each character in the text.
   *
   * To press a special key, like `Control` or `ArrowDown`,
   * use {@link ElementHandle.press}.
   *
   * @example
   *
   * ```ts
   * await elementHandle.type('Hello'); // Types instantly
   * await elementHandle.type('World', {delay: 100}); // Types slower, like a user
   * ```
   *
   * @example
   * An example of typing into a text field and then submitting the form:
   *
   * ```ts
   * const elementHandle = await page.$('input');
   * await elementHandle.type('some text');
   * await elementHandle.press('Enter');
   * ```
   *
   * @param options - Delay in milliseconds. Defaults to 0.
   */
  type(
      text: string,
      options?: Readonly<KeyboardTypeOptions>
  ): Promise<void>;

  /**
   * Focuses the element, and then uses {@link Keyboard.down} and {@link Keyboard.up}.
   *
   * @remarks
   * If `key` is a single character and no modifier keys besides `Shift`
   * are being held down, a `keypress`/`input` event will also be generated.
   * The `text` option can be specified to force an input event to be generated.
   *
   * **NOTE** Modifier keys DO affect `elementHandle.press`. Holding down `Shift`
   * will type the text in upper case.
   *
   * @param key - Name of key to press, such as `ArrowLeft`.
   * See {@link KeyInput} for a list of all key names.
   */
  press(
      key: KeyInput,
      options?: Readonly<KeyPressOptions>
  ): Promise<void>;

  /**
   * This method returns the bounding box of the element (relative to the main frame),
   * or `null` if the element is {@link https://drafts.csswg.org/css-display-4/#box-generation | not part of the layout}
   * (example: `display: none`).
   */
  boundingBox(): Promise<BoundingBox | null>;

  /**
   * This method returns boxes of the element,
   * or `null` if the element is {@link https://drafts.csswg.org/css-display-4/#box-generation | not part of the layout}
   * (example: `display: none`).
   *
   * @remarks
   *
   * Boxes are represented as an array of points;
   * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
   */
  boxModel(): Promise<BoxModel | null>;

  /**
   * This method scrolls element into view if needed, and then uses
   * {@link Page.(screenshot:2) } to take a screenshot of the element.
   * If the element is detached from DOM, the method throws an error.
   */
  screenshot(
      options: Readonly<ScreenshotOptions> & { encoding: 'base64' }
  ): Promise<string>;

  screenshot(options?: Readonly<ScreenshotOptions>): Promise<Buffer>;

  /**
   * @internal
   */
  assertConnectedElement(): Promise<void>;

  /**
   * @internal
   */
  scrollIntoViewIfNeeded(
      this: ElementHandle<Element>
  ): Promise<void>;

  /**
   * Resolves to true if the element is visible in the current viewport. If an
   * element is an SVG, we check if the svg owner element is in the viewport
   * instead. See https://crbug.com/963246.
   *
   * @param options - Threshold for the intersection between 0 (no intersection) and 1
   * (full intersection). Defaults to 1.
   */
  isIntersectingViewport(
      this: ElementHandle<Element>,
      options: {
        threshold?: number;
      }
  ): Promise<boolean>;

  /**
   * Scrolls the element into view using either the automation protocol client
   * or by calling element.scrollIntoView.
   */
  scrollIntoView(this: ElementHandle<Element>): Promise<void>;

  autofill(data: AutofillData): Promise<void>;
}

/**
 * Represents the cookie's 'SameSite' status:
 * https://tools.ietf.org/html/draft-west-first-party-cookies
 *
 * @public
 */
export type CookieSameSite = 'Strict' | 'Lax' | 'None';

/**
 * Represents the cookie's 'Priority' status:
 * https://tools.ietf.org/html/draft-west-cookie-priority-00
 *
 * @public
 */
export type CookiePriority = 'Low' | 'Medium' | 'High';

/**
 * Represents the source scheme of the origin that originally set the cookie. A value of
 * "Unset" allows protocol clients to emulate legacy cookie scope for the scheme.
 * This is a temporary ability and it will be removed in the future.
 *
 * @public
 */
export type CookieSourceScheme = 'Unset' | 'NonSecure' | 'Secure';

/**
 * Represents a cookie object.
 *
 * @public
 */
export interface Cookie {
  /**
   * Cookie name.
   */
  name: string;
  /**
   * Cookie value.
   */
  value: string;
  /**
   * Cookie domain.
   */
  domain: string;
  /**
   * Cookie path.
   */
  path: string;
  /**
   * Cookie expiration date as the number of seconds since the UNIX epoch. Set to `-1` for
   * session cookies
   */
  expires: number;
  /**
   * Cookie size.
   */
  size: number;
  /**
   * True if cookie is http-only.
   */
  httpOnly: boolean;
  /**
   * True if cookie is secure.
   */
  secure: boolean;
  /**
   * True in case of session cookie.
   */
  session: boolean;
  /**
   * Cookie SameSite type.
   */
  sameSite?: CookieSameSite;
  /**
   * Cookie Priority. Supported only in Chrome.
   */
  priority?: CookiePriority;
  /**
   * True if cookie is SameParty. Supported only in Chrome.
   */
  sameParty?: boolean;
  /**
   * Cookie source scheme type. Supported only in Chrome.
   */
  sourceScheme?: CookieSourceScheme;
  /**
   * Cookie partition key. The site of the top-level URL the browser was visiting at the
   * start of the request to the endpoint that set the cookie. Supported only in Chrome.
   */
  partitionKey?: string;
  /**
   * True if cookie partition key is opaque. Supported only in Chrome.
   */
  partitionKeyOpaque?: boolean;
}

/**
 * Cookie parameter object
 *
 * @public
 */
export interface CookieParam {
  /**
   * Cookie name.
   */
  name: string;
  /**
   * Cookie value.
   */
  value: string;
  /**
   * The request-URI to associate with the setting of the cookie. This value can affect
   * the default domain, path, and source scheme values of the created cookie.
   */
  url?: string;
  /**
   * Cookie domain.
   */
  domain?: string;
  /**
   * Cookie path.
   */
  path?: string;
  /**
   * True if cookie is secure.
   */
  secure?: boolean;
  /**
   * True if cookie is http-only.
   */
  httpOnly?: boolean;
  /**
   * Cookie SameSite type.
   */
  sameSite?: CookieSameSite;
  /**
   * Cookie expiration date, session cookie if not set
   */
  expires?: number;
  /**
   * Cookie Priority. Supported only in Chrome.
   */
  priority?: CookiePriority;
  /**
   * True if cookie is SameParty. Supported only in Chrome.
   */
  sameParty?: boolean;
  /**
   * Cookie source scheme type. Supported only in Chrome.
   */
  sourceScheme?: CookieSourceScheme;
  /**
   * Cookie partition key. The site of the top-level URL the browser was visiting at the
   * start of the request to the endpoint that set the cookie. If not set, the cookie will
   * be set as not partitioned.
   */
  partitionKey?: string;
}

/**
 * @public
 */
export interface DeleteCookiesRequest {
  /**
   * Name of the cookies to remove.
   */
  name: string;
  /**
   * If specified, deletes all the cookies with the given name where domain and path match
   * provided URL. Otherwise, deletes only cookies related to the current page's domain.
   */
  url?: string;
  /**
   * If specified, deletes only cookies with the exact domain.
   */
  domain?: string;
  /**
   * If specified, deletes only cookies with the exact path.
   */
  path?: string;
}

/**
 * @public
 */
export interface Viewport {
  /**
   * The page width in CSS pixels.
   *
   * @remarks
   * Setting this value to `0` will reset this value to the system default.
   */
  width: number;
  /**
   * The page height in CSS pixels.
   *
   * @remarks
   * Setting this value to `0` will reset this value to the system default.
   */
  height: number;
  /**
   * Specify device scale factor.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio | devicePixelRatio} for more info.
   *
   * @remarks
   * Setting this value to `0` will reset this value to the system default.
   *
   * @defaultValue `1`
   */
  deviceScaleFactor?: number;
  /**
   * Whether the `meta viewport` tag is taken into account.
   * @defaultValue `false`
   */
  isMobile?: boolean;
  /**
   * Specifies if the viewport is in landscape mode.
   * @defaultValue `false`
   */
  isLandscape?: boolean;
  /**
   * Specify if the viewport supports touch events.
   * @defaultValue `false`
   */
  hasTouch?: boolean;
}

/**
 * @public
 */
export interface RemoteAddress {
  ip?: string;
  port?: number;
}

/**
 * @public
 */
export interface ContinueRequestOverrides {
  /**
   * If set, the request URL will change. This is not a redirect.
   */
  url?: string;
  method?: string;
  postData?: string;
  headers?: Record<string, string>;
}

/**
 * @public
 */
export enum InterceptResolutionAction {
  Abort = 'abort',
  Respond = 'respond',
  Continue = 'continue',
  Disabled = 'disabled',
  None = 'none',
  AlreadyHandled = 'already-handled',
}

/**
 * @public
 */
export interface InterceptResolutionState {
  action: InterceptResolutionAction;
  priority?: number;
}

/**
 * Required response data to fulfill a request with.
 *
 * @public
 */
export interface ResponseForRequest {
  status: number;
  /**
   * Optional response headers. All values are converted to strings.
   */
  headers: Record<string, unknown>;
  contentType: string;
  body: string | Buffer;
}

/**
 * Resource types for HTTPRequests as perceived by the rendering engine.
 *
 * @public
 */
export type ResourceType = any;

/**
 * The default cooperative request interception resolution priority
 *
 * @public
 */
export const DEFAULT_INTERCEPT_RESOLUTION_PRIORITY = 0;

/**
 * @public
 */
export type ErrorCode =
    | 'aborted'
    | 'accessdenied'
    | 'addressunreachable'
    | 'blockedbyclient'
    | 'blockedbyresponse'
    | 'connectionaborted'
    | 'connectionclosed'
    | 'connectionfailed'
    | 'connectionrefused'
    | 'connectionreset'
    | 'internetdisconnected'
    | 'namenotresolved'
    | 'timedout'
    | 'failed';

interface HTTPRequest {
  url(): string;

  /**
   * The `ContinueRequestOverrides` that will be used
   * if the interception is allowed to continue (ie, `abort()` and
   * `respond()` aren't called).
   */
  continueRequestOverrides(): ContinueRequestOverrides;

  /**
   * The `ResponseForRequest` that gets used if the
   * interception is allowed to respond (ie, `abort()` is not called).
   */
  responseForRequest(): Partial<ResponseForRequest> | null;

  /**
   * The most recent reason for aborting the request
   */
  abortErrorReason(): any | null;

  /**
   * An InterceptResolutionState object describing the current resolution
   * action and priority.
   *
   * InterceptResolutionState contains:
   * action: InterceptResolutionAction
   * priority?: number
   *
   * InterceptResolutionAction is one of: `abort`, `respond`, `continue`,
   * `disabled`, `none`, or `already-handled`.
   */
  interceptResolutionState(): InterceptResolutionState;

  /**
   * Is `true` if the intercept resolution has already been handled,
   * `false` otherwise.
   */
  isInterceptResolutionHandled(): boolean;

  /**
   * Adds an async request handler to the processing queue.
   * Deferred handlers are not guaranteed to execute in any particular order,
   * but they are guaranteed to resolve before the request interception
   * is finalized.
   */
  enqueueInterceptAction(
      pendingHandler: () => void | PromiseLike<unknown>
  ): void;

  /**
   * Awaits pending interception handlers and then decides how to fulfill
   * the request interception.
   */
  finalizeInterceptions(): Promise<void>;

  resourceType(): ResourceType;

  method(): string;

  postData(): string | undefined;

  hasPostData(): boolean;

  fetchPostData(): Promise<string | undefined>;

  headers(): Record<string, string>;

  response(): HTTPResponse | null;

  frame(): Frame | null;

  isNavigationRequest(): boolean;

  initiator(): any | undefined;

  redirectChain(): HTTPRequest[];

  failure(): { errorText: string } | null;

  /**
   * Continues request with optional request overrides.
   *
   * @example
   *
   * ```ts
   * await page.setRequestInterception(true);
   * page.on('request', request => {
   *   // Override headers
   *   const headers = Object.assign({}, request.headers(), {
   *     foo: 'bar', // set "foo" header
   *     origin: undefined, // remove "origin" header
   *   });
   *   request.continue({headers});
   * });
   * ```
   *
   * @param overrides - optional overrides to apply to the request.
   * @param priority - If provided, intercept is resolved using cooperative
   * handling rules. Otherwise, intercept is resolved immediately.
   *
   * @remarks
   *
   * To use this, request interception should be enabled with
   * {@link Page.setRequestInterception}.
   *
   * Exception is immediately thrown if the request interception is not enabled.
   */
  continue(
      overrides: ContinueRequestOverrides,
      priority?: number
  ): Promise<void>;

  /**
   * Fulfills a request with the given response.
   *
   * @example
   * An example of fulfilling all requests with 404 responses:
   *
   * ```ts
   * await page.setRequestInterception(true);
   * page.on('request', request => {
   *   request.respond({
   *     status: 404,
   *     contentType: 'text/plain',
   *     body: 'Not Found!',
   *   });
   * });
   * ```
   *
   * NOTE: Mocking responses for dataURL requests is not supported.
   * Calling `request.respond` for a dataURL request is a noop.
   *
   * @param response - the response to fulfill the request with.
   * @param priority - If provided, intercept is resolved using
   * cooperative handling rules. Otherwise, intercept is resolved
   * immediately.
   *
   * @remarks
   *
   * To use this, request
   * interception should be enabled with {@link Page.setRequestInterception}.
   *
   * Exception is immediately thrown if the request interception is not enabled.
   */
  respond(
      response: Partial<ResponseForRequest>,
      priority?: number
  ): Promise<void>;

  /**
   * Aborts a request.
   *
   * @param errorCode - optional error code to provide.
   * @param priority - If provided, intercept is resolved using
   * cooperative handling rules. Otherwise, intercept is resolved
   * immediately.
   *
   * @remarks
   *
   * To use this, request interception should be enabled with
   * {@link Page.setRequestInterception}. If it is not enabled, this method will
   * throw an exception immediately.
   */
  abort(
      errorCode: ErrorCode,
      priority?: number
  ): Promise<void>;
}

interface SecurityDetails {
  /**
   * The name of the issuer of the certificate.
   */
  issuer(): string;

  /**
   * {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
   * marking the start of the certificate's validity.
   */
  validFrom(): number;

  /**
   * {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
   * marking the end of the certificate's validity.
   */
  validTo(): number;

  /**
   * The security protocol being used, e.g. "TLS 1.2".
   */
  protocol(): string;

  /**
   * The name of the subject to which the certificate was issued.
   */
  subjectName(): string;

  /**
   * The list of {@link https://en.wikipedia.org/wiki/Subject_Alternative_Name | subject alternative names (SANs)} of the certificate.
   */
  subjectAlternativeNames(): string[];
}

interface HTTPResponse {
  remoteAddress(): RemoteAddress;

  url(): string;

  /**
   * True if the response was successful (status in the range 200-299).
   */
  ok(): boolean;

  status(): number;

  statusText(): string;

  headers(): Record<string, string>;

  securityDetails(): SecurityDetails | null;

  timing(): any | null;

  buffer(): Promise<Buffer>;

  /**
   * Promise which resolves to a text (utf8) representation of response body.
   */
  text(): Promise<string>;

  /**
   * Promise which resolves to a JSON representation of response body.
   *
   * @remarks
   *
   * This method will throw if the response body is not parsable via
   * `JSON.parse`.
   */
  json(): Promise<any>;

  request(): HTTPRequest;

  fromCache(): boolean;

  fromServiceWorker(): boolean;

  frame(): Frame | null;
}

/**
 * @public
 */
export interface Device {
  userAgent: string;
  viewport: Viewport;
}

/**
 * @public
 */
export interface NewDocumentScriptEvaluation {
  identifier: string;
}

interface ScreenRecorder {
  /**
   * Stops the recorder.
   *
   * @public
   */
  stop(): Promise<void>;
}

/**
 * @public
 */
export interface PDFMargin {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

/**
 * @public
 */
export type LowerCasePaperFormat =
    | 'letter'
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

/**
 * All the valid paper format types when printing a PDF.
 *
 * @remarks
 *
 * The sizes of each format are as follows:
 *
 * - `Letter`: 8.5in x 11in
 *
 * - `Legal`: 8.5in x 14in
 *
 * - `Tabloid`: 11in x 17in
 *
 * - `Ledger`: 17in x 11in
 *
 * - `A0`: 33.1in x 46.8in
 *
 * - `A1`: 23.4in x 33.1in
 *
 * - `A2`: 16.54in x 23.4in
 *
 * - `A3`: 11.7in x 16.54in
 *
 * - `A4`: 8.27in x 11.7in
 *
 * - `A5`: 5.83in x 8.27in
 *
 * - `A6`: 4.13in x 5.83in
 *
 * @public
 */
export type PaperFormat =
    | Uppercase<LowerCasePaperFormat>
    | Capitalize<LowerCasePaperFormat>
    | LowerCasePaperFormat;

/**
 * Valid options to configure PDF generation via {@link Page.pdf}.
 * @public
 */
export interface PDFOptions {
  /**
   * Scales the rendering of the web page. Amount must be between `0.1` and `2`.
   * @defaultValue `1`
   */
  scale?: number;
  /**
   * Whether to show the header and footer.
   * @defaultValue `false`
   */
  displayHeaderFooter?: boolean;
  /**
   * HTML template for the print header. Should be valid HTML with the following
   * classes used to inject values into them:
   *
   * - `date` formatted print date
   *
   * - `title` document title
   *
   * - `url` document location
   *
   * - `pageNumber` current page number
   *
   * - `totalPages` total pages in the document
   */
  headerTemplate?: string;
  /**
   * HTML template for the print footer. Has the same constraints and support
   * for special classes as {@link PDFOptions.headerTemplate}.
   */
  footerTemplate?: string;
  /**
   * Set to `true` to print background graphics.
   * @defaultValue `false`
   */
  printBackground?: boolean;
  /**
   * Whether to print in landscape orientation.
   * @defaultValue `false`
   */
  landscape?: boolean;
  /**
   * Paper ranges to print, e.g. `1-5, 8, 11-13`.
   * @defaultValue The empty string, which means all pages are printed.
   */
  pageRanges?: string;
  /**
   * @remarks
   * If set, this takes priority over the `width` and `height` options.
   * @defaultValue `letter`.
   */
  format?: PaperFormat;
  /**
   * Sets the width of paper. You can pass in a number or a string with a unit.
   */
  width?: string | number;
  /**
   * Sets the height of paper. You can pass in a number or a string with a unit.
   */
  height?: string | number;
  /**
   * Give any CSS `@page` size declared in the page priority over what is
   * declared in the `width` or `height` or `format` option.
   * @defaultValue `false`, which will scale the content to fit the paper size.
   */
  preferCSSPageSize?: boolean;
  /**
   * Set the PDF margins.
   * @defaultValue `undefined` no margins are set.
   */
  margin?: PDFMargin;
  /**
   * The path to save the file to.
   *
   * @remarks
   *
   * If the path is relative, it's resolved relative to the current working directory.
   *
   * @defaultValue `undefined`, which means the PDF will not be written to disk.
   */
  path?: string;
  /**
   * Hides default white background and allows generating pdfs with transparency.
   * @defaultValue `false`
   */
  omitBackground?: boolean;
  /**
   * Generate tagged (accessible) PDF.
   * @defaultValue `true`
   * @experimental
   */
  tagged?: boolean;
  /**
   * Generate document outline.
   *
   * @remarks
   * If this is enabled the PDF will also be tagged (accessible)
   * Currently only works in old Headless (headless = 'shell')
   * crbug/840455#c47
   *
   * @defaultValue `false`
   * @experimental
   */
  outline?: boolean;
  /**
   * Timeout in milliseconds. Pass `0` to disable timeout.
   * @defaultValue `30_000`
   */
  timeout?: number;
}

interface DeviceRequestPromptDevice {
  id: string;
  name: string;
}

interface DeviceRequestPrompt {
  /**
   * Resolve to the first device in the prompt matching a filter.
   */
  waitForDevice(
      filter: (device: DeviceRequestPromptDevice) => boolean,
      options: WaitTimeoutOptions
  ): Promise<DeviceRequestPromptDevice>;

  /**
   * Select a device in the prompt's list.
   */
  select(device: DeviceRequestPromptDevice): Promise<void>;

  /**
   * Cancel the prompt.
   */
  cancel(): Promise<void>;
}

export interface Page {
  readonly keyboard: Keyboard;
  readonly touchscreen: Touchscreen;
  readonly coverage: Coverage;
  readonly tracing: Tracing;
  readonly accessibility: Accessibility;
  readonly mouse: Mouse;

  isServiceWorkerBypassed(): boolean;

  isDragInterceptionEnabled(): boolean;

  isJavaScriptEnabled(): boolean;

  waitForFileChooser(
      options?: WaitTimeoutOptions
  ): Promise<FileChooser>;

  setGeolocation(options: GeolocationOptions): Promise<void>;

  target(): Target;

  browser(): Browser;

  browserContext(): BrowserContext;

  mainFrame(): Frame;

  createCDPSession(): Promise<CDPSession>;

  frames(): Frame[];

  workers(): WebWorker[];

  setRequestInterception(value: boolean): Promise<void>;

  setBypassServiceWorker(bypass: boolean): Promise<void>;

  setDragInterception(enabled: boolean): Promise<void>;

  setOfflineMode(enabled: boolean): Promise<void>;

  emulateNetworkConditions(
      networkConditions: NetworkConditions | null
  ): Promise<void>;

  setDefaultNavigationTimeout(timeout: number): void;

  setDefaultTimeout(timeout: number): void;

  getDefaultTimeout(): number;

  /**
   * Creates a locator for the provided selector. See {@link Locator} for
   * details and supported actions.
   *
   * @remarks
   * Locators API is experimental and we will not follow semver for breaking
   * change in the Locators API.
   */
  locator<Selector extends string>(
      selector: Selector
  ): Locator<NodeFor<Selector>>;

  /**
   * Creates a locator for the provided function. See {@link Locator} for
   * details and supported actions.
   *
   * @remarks
   * Locators API is experimental and we will not follow semver for breaking
   * change in the Locators API.
   */
  locator<Ret>(func: () => Awaitable<Ret>): Locator<Ret>;

  locator<Selector extends string, Ret>(
      selectorOrFunc: Selector | ( () => Awaitable<Ret> )
  ): Locator<NodeFor<Selector>> | Locator<Ret>;

  /**
   * Runs `document.querySelector` within the page. If no element matches the
   * selector, the return value resolves to `null`.
   *
   * @param selector - A `selector` to query page for
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * to query page for.
   */
  $<Selector extends string>(
      selector: Selector
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * The method runs `document.querySelectorAll` within the page. If no elements
   * match the selector, the return value resolves to `[]`.
   *
   * @param selector - A `selector` to query page for
   *
   * @remarks
   *
   * Shortcut for {@link Frame.$$ | Page.mainFrame().$$(selector) }.
   */
  $$<Selector extends string>(
      selector: Selector
  ): Promise<Array<ElementHandle<NodeFor<Selector>>>>;

  /**
   * @remarks
   *
   * The only difference between {@link Page.evaluate | page.evaluate} and
   * `page.evaluateHandle` is that `evaluateHandle` will return the value
   * wrapped in an in-page object.
   *
   * If the function passed to `page.evaluateHandle` returns a Promise, the
   * function will wait for the promise to resolve and return its value.
   *
   * You can pass a string instead of a function (although functions are
   * recommended as they are easier to debug and use with TypeScript):
   *
   * @example
   *
   * ```ts
   * const aHandle = await page.evaluateHandle('document');
   * ```
   *
   * @example
   * {@link JSHandle} instances can be passed as arguments to the `pageFunction`:
   *
   * ```ts
   * const aHandle = await page.evaluateHandle(() => document.body);
   * const resultHandle = await page.evaluateHandle(
   *   body => body.innerHTML,
   *   aHandle
   * );
   * console.log(await resultHandle.jsonValue());
   * await resultHandle.dispose();
   * ```
   *
   * Most of the time this function returns a {@link JSHandle},
   * but if `pageFunction` returns a reference to an element,
   * you instead get an {@link ElementHandle} back:
   *
   * @example
   *
   * ```ts
   * const button = await page.evaluateHandle(() =>
   *   document.querySelector('button')
   * );
   * // can call `click` because `button` is an `ElementHandle`
   * await button.click();
   * ```
   *
   * The TypeScript definitions assume that `evaluateHandle` returns
   * a `JSHandle`, but if you know it's going to return an
   * `ElementHandle`, pass it as the generic argument:
   *
   * ```ts
   * const button = await page.evaluateHandle<ElementHandle>(...);
   * ```
   *
   * @param pageFunction - a function that is run within the page
   * @param args - arguments to be passed to the pageFunction
   */
  evaluateHandle<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  queryObjects<Prototype>(
      prototypeHandle: JSHandle<Prototype>
  ): Promise<JSHandle<Prototype[]>>;

  /**
   * This method runs `document.querySelector` within the page and passes the
   * result as the first argument to the `pageFunction`.
   *
   * @remarks
   *
   * If no element is found matching `selector`, the method will throw an error.
   *
   * If `pageFunction` returns a promise `$eval` will wait for the promise to
   * resolve and then return its value.
   *
   * @example
   *
   * ```ts
   * const searchValue = await page.$eval('#search', el => el.value);
   * const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
   * const html = await page.$eval('.main-container', el => el.outerHTML);
   * ```
   *
   * If you are using TypeScript, you may have to provide an explicit type to the
   * first argument of the `pageFunction`.
   * By default it is typed as `Element`, but you may need to provide a more
   * specific sub-type:
   *
   * @example
   *
   * ```ts
   * // if you don't provide HTMLInputElement here, TS will error
   * // as `value` is not on `Element`
   * const searchValue = await page.$eval(
   *   '#search',
   *   (el: HTMLInputElement) => el.value
   * );
   * ```
   *
   * The compiler should be able to infer the return type
   * from the `pageFunction` you provide. If it is unable to, you can use the generic
   * type to tell the compiler what return type you expect from `$eval`:
   *
   * @example
   *
   * ```ts
   * // The compiler can infer the return type in this case, but if it can't
   * // or if you want to be more explicit, provide it as the generic type.
   * const searchValue = await page.$eval<string>(
   *   '#search',
   *   (el: HTMLInputElement) => el.value
   * );
   * ```
   *
   * @param selector - the
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * to query for
   * @param pageFunction - the function to be evaluated in the page context.
   * Will be passed the result of `document.querySelector(selector)` as its
   * first argument.
   * @param args - any additional arguments to pass through to `pageFunction`.
   *
   * @returns The result of calling `pageFunction`. If it returns an element it
   * is wrapped in an {@link ElementHandle}, else the raw value itself is
   * returned.
   */
  $eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<NodeFor<Selector>, Params> = EvaluateFuncWith<
          NodeFor<Selector>,
          Params
      >,
  >(
      selector: Selector,
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  /**
   * This method runs `Array.from(document.querySelectorAll(selector))` within
   * the page and passes the result as the first argument to the `pageFunction`.
   *
   * @remarks
   * If `pageFunction` returns a promise `$$eval` will wait for the promise to
   * resolve and then return its value.
   *
   * @example
   *
   * ```ts
   * // get the amount of divs on the page
   * const divCount = await page.$$eval('div', divs => divs.length);
   *
   * // get the text content of all the `.options` elements:
   * const options = await page.$$eval('div > span.options', options => {
   *   return options.map(option => option.textContent);
   * });
   * ```
   *
   * If you are using TypeScript, you may have to provide an explicit type to the
   * first argument of the `pageFunction`.
   * By default it is typed as `Element[]`, but you may need to provide a more
   * specific sub-type:
   *
   * @example
   *
   * ```ts
   * await page.$$eval('input', elements => {
   *   return elements.map(e => e.value);
   * });
   * ```
   *
   * The compiler should be able to infer the return type
   * from the `pageFunction` you provide. If it is unable to, you can use the generic
   * type to tell the compiler what return type you expect from `$$eval`:
   *
   * @example
   *
   * ```ts
   * const allInputValues = await page.$$eval('input', elements =>
   *   elements.map(e => e.textContent)
   * );
   * ```
   *
   * @param selector - the
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * to query for
   * @param pageFunction - the function to be evaluated in the page context.
   * Will be passed the result of
   * `Array.from(document.querySelectorAll(selector))` as its first argument.
   * @param args - any additional arguments to pass through to `pageFunction`.
   *
   * @returns The result of calling `pageFunction`. If it returns an element it
   * is wrapped in an {@link ElementHandle}, else the raw value itself is
   * returned.
   */
  $$eval<
      Selector extends string,
      Params extends unknown[],
      Func extends EvaluateFuncWith<
          Array<NodeFor<Selector>>,
          Params
      > = EvaluateFuncWith<Array<NodeFor<Selector>>, Params>,
  >(
      selector: Selector,
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  cookies(...urls: string[]): Promise<Cookie[]>;

  deleteCookie(...cookies: DeleteCookiesRequest[]): Promise<void>;

  setCookie(...cookies: CookieParam[]): Promise<void>;

  /**
   * Adds a `<script>` tag into the page with the desired URL or content.
   *
   * @remarks
   * Shortcut for
   * {@link Frame.addScriptTag | page.mainFrame().addScriptTag(options)}.
   *
   * @param options - Options for the script.
   * @returns An {@link ElementHandle | element handle} to the injected
   * `<script>` element.
   */
  addScriptTag(
      options: FrameAddScriptTagOptions
  ): Promise<ElementHandle<HTMLScriptElement>>;

  /**
   * Adds a `<link rel="stylesheet">` tag into the page with the desired URL or
   * a `<style type="text/css">` tag with the content.
   *
   * Shortcut for
   * {@link Frame.(addStyleTag:2) | page.mainFrame().addStyleTag(options)}.
   *
   * @returns An {@link ElementHandle | element handle} to the injected `<link>`
   * or `<style>` element.
   */
  addStyleTag(
      options: Omit<FrameAddStyleTagOptions, 'url'>
  ): Promise<ElementHandle<HTMLStyleElement>>;

  addStyleTag(
      options: FrameAddStyleTagOptions
  ): Promise<ElementHandle<HTMLLinkElement>>;

  addStyleTag(
      options: FrameAddStyleTagOptions
  ): Promise<ElementHandle<HTMLStyleElement | HTMLLinkElement>>;

  exposeFunction(
      name: string,
      pptrFunction: Function | { default: Function }
  ): Promise<void>;

  removeExposedFunction(name: string): Promise<void>;

  authenticate(credentials: Credentials): Promise<void>;

  setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;

  setUserAgent(
      userAgent: string,
      userAgentMetadata?: any
  ): Promise<void>;

  metrics(): Promise<Metrics>;

  /**
   * The page's URL.
   *
   * @remarks
   *
   * Shortcut for {@link Frame.url | page.mainFrame().url()}.
   */
  url(): string;

  /**
   * The full HTML contents of the page, including the DOCTYPE.
   */
  content(): Promise<string>;

  /**
   * Set the content of the page.
   *
   * @param html - HTML markup to assign to the page.
   * @param options - Parameters that has some properties.
   *
   * @remarks
   *
   * The parameter `options` might have the following options.
   *
   * - `timeout` : Maximum time in milliseconds for resources to load, defaults
   *   to 30 seconds, pass `0` to disable timeout. The default value can be
   *   changed by using the {@link Page.setDefaultNavigationTimeout} or
   *   {@link Page.setDefaultTimeout} methods.
   *
   * - `waitUntil`: When to consider setting markup succeeded, defaults to
   *   `load`. Given an array of event strings, setting content is considered
   *   to be successful after all events have been fired. Events can be
   *   either:<br/>
   * - `load` : consider setting content to be finished when the `load` event
   *   is fired.<br/>
   * - `domcontentloaded` : consider setting content to be finished when the
   *   `DOMContentLoaded` event is fired.<br/>
   * - `networkidle0` : consider setting content to be finished when there are
   *   no more than 0 network connections for at least `500` ms.<br/>
   * - `networkidle2` : consider setting content to be finished when there are
   *   no more than 2 network connections for at least `500` ms.
   */
  setContent(html: string, options?: WaitForOptions): Promise<void>;

  /**
   * Navigates the page to the given `url`.
   *
   * @remarks
   *
   * Navigation to `about:blank` or navigation to the same URL with a different
   * hash will succeed and return `null`.
   *
   * :::warning
   *
   * Headless mode doesn't support navigation to a PDF document. See the {@link
   * https://bugs.chromium.org/p/chromium/issues/detail?id=761295 | upstream
   * issue}.
   *
   * :::
   *
   * Shortcut for {@link Frame.goto | page.mainFrame().goto(url, options)}.
   *
   * @param url - URL to navigate page to. The URL should include scheme, e.g.
   * `https://`
   * @param options - Options to configure waiting behavior.
   * @returns A promise which resolves to the main resource response. In case of
   * multiple redirects, the navigation will resolve with the response of the
   * last redirect.
   * @throws If:
   *
   * - there's an SSL error (e.g. in case of self-signed certificates).
   * - target URL is invalid.
   * - the timeout is exceeded during navigation.
   * - the remote server does not respond or is unreachable.
   * - the main resource failed to load.
   *
   * This method will not throw an error when any valid HTTP status code is
   * returned by the remote server, including 404 "Not Found" and 500 "Internal
   * Server Error". The status code for such responses can be retrieved by
   * calling {@link HTTPResponse.status}.
   */
  goto(url: string, options?: GoToOptions): Promise<HTTPResponse | null>;

  reload(options?: WaitForOptions): Promise<HTTPResponse | null>;

  /**
   * Waits for the page to navigate to a new URL or to reload. It is useful when
   * you run code that will indirectly cause the page to navigate.
   *
   * @example
   *
   * ```ts
   * const [response] = await Promise.all([
   *   page.waitForNavigation(), // The promise resolves after navigation has finished
   *   page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
   * ]);
   * ```
   *
   * @remarks
   *
   * Usage of the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
   * to change the URL is considered a navigation.
   *
   * @param options - Navigation parameters which might have the following
   * properties:
   * @returns A `Promise` which resolves to the main resource response.
   *
   * - In case of multiple redirects, the navigation will resolve with the
   *   response of the last redirect.
   * - In case of navigation to a different anchor or navigation due to History
   *   API usage, the navigation will resolve with `null`.
   */
  waitForNavigation(
      options: WaitForOptions
  ): Promise<HTTPResponse | null>;

  /**
   * @param urlOrPredicate - A URL or predicate to wait for
   * @param options - Optional waiting parameters
   * @returns Promise which resolves to the matched request
   * @example
   *
   * ```ts
   * const firstRequest = await page.waitForRequest(
   *   'https://example.com/resource'
   * );
   * const finalRequest = await page.waitForRequest(
   *   request => request.url() === 'https://example.com'
   * );
   * return finalRequest.response()?.ok();
   * ```
   *
   * @remarks
   * Optional Waiting Parameters have:
   *
   * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds, pass
   *   `0` to disable the timeout. The default value can be changed by using the
   *   {@link Page.setDefaultTimeout} method.
   */
  waitForRequest(
      urlOrPredicate: string | AwaitablePredicate<HTTPRequest>,
      options: WaitTimeoutOptions
  ): Promise<HTTPRequest>;

  /**
   * @param urlOrPredicate - A URL or predicate to wait for.
   * @param options - Optional waiting parameters
   * @returns Promise which resolves to the matched response.
   * @example
   *
   * ```ts
   * const firstResponse = await page.waitForResponse(
   *   'https://example.com/resource'
   * );
   * const finalResponse = await page.waitForResponse(
   *   response =>
   *     response.url() === 'https://example.com' && response.status() === 200
   * );
   * const finalResponse = await page.waitForResponse(async response => {
   *   return (await response.text()).includes('<html>');
   * });
   * return finalResponse.ok();
   * ```
   *
   * @remarks
   * Optional Parameter have:
   *
   * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
   *   pass `0` to disable the timeout. The default value can be changed by using
   *   the {@link Page.setDefaultTimeout} method.
   */
  waitForResponse(
      urlOrPredicate: string | AwaitablePredicate<HTTPResponse>,
      options: WaitTimeoutOptions
  ): Promise<HTTPResponse>;

  /**
   * Waits for the network to be idle.
   *
   * @param options - Options to configure waiting behavior.
   * @returns A promise which resolves once the network is idle.
   */
  waitForNetworkIdle(options: WaitForNetworkIdleOptions): Promise<void>;

  /**
   * Waits for a frame matching the given conditions to appear.
   *
   * @example
   *
   * ```ts
   * const frame = await page.waitForFrame(async frame => {
   *   return frame.name() === 'Test';
   * });
   * ```
   */
  waitForFrame(
      urlOrPredicate: string | ( (frame: Frame) => Awaitable<boolean> ),
      options: WaitTimeoutOptions
  ): Promise<Frame>;

  goBack(options?: WaitForOptions): Promise<HTTPResponse | null>;

  goForward(options?: WaitForOptions): Promise<HTTPResponse | null>;

  bringToFront(): Promise<void>;

  /**
   * Emulates a given device's metrics and user agent.
   *
   * To aid emulation, Puppeteer provides a list of known devices that can be
   * via {@link KnownDevices}.
   *
   * @remarks
   * This method is a shortcut for calling two methods:
   * {@link Page.setUserAgent} and {@link Page.setViewport}.
   *
   * This method will resize the page. A lot of websites don't expect phones to
   * change size, so you should emulate before navigating to the page.
   *
   * @example
   *
   * ```ts
   * import {KnownDevices} from 'puppeteer';
   * const iPhone = KnownDevices['iPhone 6'];
   *
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   await page.emulate(iPhone);
   *   await page.goto('https://www.google.com');
   *   // other actions...
   *   await browser.close();
   * })();
   * ```
   */
  emulate(device: Device): Promise<void>;

  setJavaScriptEnabled(enabled: boolean): Promise<void>;

  setBypassCSP(enabled: boolean): Promise<void>;

  emulateMediaType(type?: string): Promise<void>;

  emulateCPUThrottling(factor: number | null): Promise<void>;

  emulateMediaFeatures(features?: MediaFeature[]): Promise<void>;

  emulateTimezone(timezoneId?: string): Promise<void>;

  emulateIdleState(overrides?: {
    isUserActive: boolean;
    isScreenUnlocked: boolean;
  }): Promise<void>;

  emulateVisionDeficiency(
      type?: any
  ): Promise<void>;

  setViewport(viewport: Viewport): Promise<void>;

  viewport(): Viewport | null;

  /**
   * Evaluates a function in the page's context and returns the result.
   *
   * If the function passed to `page.evaluate` returns a Promise, the
   * function will wait for the promise to resolve and return its value.
   *
   * @example
   *
   * ```ts
   * const result = await frame.evaluate(() => {
   *   return Promise.resolve(8 * 7);
   * });
   * console.log(result); // prints "56"
   * ```
   *
   * You can pass a string instead of a function (although functions are
   * recommended as they are easier to debug and use with TypeScript):
   *
   * @example
   *
   * ```ts
   * const aHandle = await page.evaluate('1 + 2');
   * ```
   *
   * To get the best TypeScript experience, you should pass in as the
   * generic the type of `pageFunction`:
   *
   * ```ts
   * const aHandle = await page.evaluate(() => 2);
   * ```
   *
   * @example
   *
   * {@link ElementHandle} instances (including {@link JSHandle}s) can be passed
   * as arguments to the `pageFunction`:
   *
   * ```ts
   * const bodyHandle = await page.$('body');
   * const html = await page.evaluate(body => body.innerHTML, bodyHandle);
   * await bodyHandle.dispose();
   * ```
   *
   * @param pageFunction - a function that is run within the page
   * @param args - arguments to be passed to the pageFunction
   *
   * @returns the return value of `pageFunction`.
   */
  evaluate<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<Awaited<ReturnType<Func>>>;

  evaluateOnNewDocument<
      Params extends unknown[],
      Func extends (...args: Params) => unknown = (...args: Params) => unknown,
  >(
      pageFunction: Func | string,
      ...args: Params
  ): Promise<NewDocumentScriptEvaluation>;

  removeScriptToEvaluateOnNewDocument(
      identifier: string
  ): Promise<void>;

  setCacheEnabled(enabled?: boolean): Promise<void>;

  /**
   * Captures a screencast of this {@link Page | page}.
   *
   * @example
   * Recording a {@link Page | page}:
   *
   * ```
   * import puppeteer from 'puppeteer';
   *
   * // Launch a browser
   * const browser = await puppeteer.launch();
   *
   * // Create a new page
   * const page = await browser.newPage();
   *
   * // Go to your site.
   * await page.goto("https://www.example.com");
   *
   * // Start recording.
   * const recorder = await page.screencast({path: 'recording.webm'});
   *
   * // Do something.
   *
   * // Stop recording.
   * await recorder.stop();
   *
   * browser.close();
   * ```
   *
   * @param options - Configures screencast behavior.
   *
   * @experimental
   *
   * @remarks
   *
   * All recordings will be {@link https://www.webmproject.org/ | WebM} format using
   * the {@link https://www.webmproject.org/vp9/ | VP9} video codec. The FPS is 30.
   *
   * You must have {@link https://ffmpeg.org/ | ffmpeg} installed on your system.
   */
  screencast(
      options: Readonly<ScreencastOptions>
  ): Promise<ScreenRecorder>;

  /**
   * Captures a screenshot of this {@link Page | page}.
   *
   * @param options - Configures screenshot behavior.
   */
  screenshot(
      options: Readonly<ScreenshotOptions> & { encoding: 'base64' }
  ): Promise<string>;

  screenshot(options?: Readonly<ScreenshotOptions>): Promise<Buffer>;

  createPDFStream(
      options?: PDFOptions
  ): Promise<ReadableStream<Uint8Array>>;

  pdf(options?: PDFOptions): Promise<Buffer>;

  /**
   * The page's title
   *
   * @remarks
   *
   * Shortcut for {@link Frame.title | page.mainFrame().title()}.
   */
  title(): Promise<string>;

  close(options?: { runBeforeUnload?: boolean }): Promise<void>;

  isClosed(): boolean;

  /**
   * This method fetches an element with `selector`, scrolls it into view if
   * needed, and then uses {@link Page.mouse} to click in the center of the
   * element. If there's no element matching `selector`, the method throws an
   * error.
   *
   * @remarks
   *
   * Bear in mind that if `click()` triggers a navigation event and
   * there's a separate `page.waitForNavigation()` promise to be resolved, you
   * may end up with a race condition that yields unexpected results. The
   * correct pattern for click and wait for navigation is the following:
   *
   * ```ts
   * const [response] = await Promise.all([
   *   page.waitForNavigation(waitOptions),
   *   page.click(selector, clickOptions),
   * ]);
   * ```
   *
   * Shortcut for {@link Frame.click | page.mainFrame().click(selector[, options]) }.
   * @param selector - A `selector` to search for element to click. If there are
   * multiple elements satisfying the `selector`, the first will be clicked
   * @param options - `Object`
   * @returns Promise which resolves when the element matching `selector` is
   * successfully clicked. The Promise will be rejected if there is no element
   * matching `selector`.
   */
  click(selector: string, options?: Readonly<ClickOptions>): Promise<void>;

  /**
   * This method fetches an element with `selector` and focuses it. If there's no
   * element matching `selector`, the method throws an error.
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector }
   * of an element to focus. If there are multiple elements satisfying the
   * selector, the first will be focused.
   * @returns Promise which resolves when the element matching selector is
   * successfully focused. The promise will be rejected if there is no element
   * matching selector.
   *
   * @remarks
   *
   * Shortcut for {@link Frame.focus | page.mainFrame().focus(selector)}.
   */
  focus(selector: string): Promise<void>;

  /**
   * This method fetches an element with `selector`, scrolls it into view if
   * needed, and then uses {@link Page.mouse}
   * to hover over the center of the element.
   * If there's no element matching `selector`, the method throws an error.
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * to search for element to hover. If there are multiple elements satisfying
   * the selector, the first will be hovered.
   * @returns Promise which resolves when the element matching `selector` is
   * successfully hovered. Promise gets rejected if there's no element matching
   * `selector`.
   *
   * @remarks
   *
   * Shortcut for {@link Page.hover | page.mainFrame().hover(selector)}.
   */
  hover(selector: string): Promise<void>;

  /**
   * Triggers a `change` and `input` event once all the provided options have been
   * selected. If there's no `<select>` element matching `selector`, the method
   * throws an error.
   *
   * @example
   *
   * ```ts
   * page.select('select#colors', 'blue'); // single selection
   * page.select('select#colors', 'red', 'green', 'blue'); // multiple selections
   * ```
   *
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
   * to query the page for
   * @param values - Values of options to select. If the `<select>` has the
   * `multiple` attribute, all values are considered, otherwise only the first one
   * is taken into account.
   * @returns
   *
   * @remarks
   *
   * Shortcut for {@link Frame.select | page.mainFrame().select()}
   */
  select(selector: string, ...values: string[]): Promise<string[]>;

  /**
   * This method fetches an element with `selector`, scrolls it into view if
   * needed, and then uses {@link Page.touchscreen}
   * to tap in the center of the element.
   * If there's no element matching `selector`, the method throws an error.
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
   * to search for element to tap. If there are multiple elements satisfying the
   * selector, the first will be tapped.
   *
   * @remarks
   *
   * Shortcut for {@link Frame.tap | page.mainFrame().tap(selector)}.
   */
  tap(selector: string): Promise<void>;

  /**
   * Sends a `keydown`, `keypress/input`, and `keyup` event for each character
   * in the text.
   *
   * To press a special key, like `Control` or `ArrowDown`, use {@link Keyboard.press}.
   * @example
   *
   * ```ts
   * await page.type('#mytextarea', 'Hello');
   * // Types instantly
   * await page.type('#mytextarea', 'World', {delay: 100});
   * // Types slower, like a user
   * ```
   *
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * of an element to type into. If there are multiple elements satisfying the
   * selector, the first will be used.
   * @param text - A text to type into a focused element.
   * @param options - have property `delay` which is the Time to wait between
   * key presses in milliseconds. Defaults to `0`.
   * @returns
   */
  type(
      selector: string,
      text: string,
      options?: Readonly<KeyboardTypeOptions>
  ): Promise<void>;

  /**
   * Wait for the `selector` to appear in page. If at the moment of calling the
   * method the `selector` already exists, the method will return immediately. If
   * the `selector` doesn't appear after the `timeout` milliseconds of waiting, the
   * function will throw.
   *
   * @example
   * This method works across navigations:
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   let currentURL;
   *   page
   *     .waitForSelector('img')
   *     .then(() => console.log('First URL with image: ' + currentURL));
   *   for (currentURL of [
   *     'https://example.com',
   *     'https://google.com',
   *     'https://bbc.com',
   *   ]) {
   *     await page.goto(currentURL);
   *   }
   *   await browser.close();
   * })();
   * ```
   *
   * @param selector - A
   * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
   * of an element to wait for
   * @param options - Optional waiting parameters
   * @returns Promise which resolves when element specified by selector string
   * is added to DOM. Resolves to `null` if waiting for hidden: `true` and
   * selector is not found in DOM.
   *
   * @remarks
   * The optional Parameter in Arguments `options` are:
   *
   * - `visible`: A boolean wait for element to be present in DOM and to be
   *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
   *   properties. Defaults to `false`.
   *
   * - `hidden`: Wait for element to not be found in the DOM or to be hidden,
   *   i.e. have `display: none` or `visibility: hidden` CSS properties. Defaults to
   *   `false`.
   *
   * - `timeout`: maximum time to wait for in milliseconds. Defaults to `30000`
   *   (30 seconds). Pass `0` to disable timeout. The default value can be changed
   *   by using the {@link Page.setDefaultTimeout} method.
   */
  waitForSelector<Selector extends string>(
      selector: Selector,
      options: WaitForSelectorOptions
  ): Promise<ElementHandle<NodeFor<Selector>> | null>;

  /**
   * Waits for the provided function, `pageFunction`, to return a truthy value when
   * evaluated in the page's context.
   *
   * @example
   * {@link Page.waitForFunction} can be used to observe a viewport size change:
   *
   * ```ts
   * import puppeteer from 'puppeteer';
   * (async () => {
   *   const browser = await puppeteer.launch();
   *   const page = await browser.newPage();
   *   const watchDog = page.waitForFunction('window.innerWidth < 100');
   *   await page.setViewport({width: 50, height: 50});
   *   await watchDog;
   *   await browser.close();
   * })();
   * ```
   *
   * @example
   * Arguments can be passed from Node.js to `pageFunction`:
   *
   * ```ts
   * const selector = '.foo';
   * await page.waitForFunction(
   *   selector => !!document.querySelector(selector),
   *   {},
   *   selector
   * );
   * ```
   *
   * @example
   * The provided `pageFunction` can be asynchronous:
   *
   * ```ts
   * const username = 'github-username';
   * await page.waitForFunction(
   *   async username => {
   *     const githubResponse = await fetch(
   *       `https://api.github.com/users/${username}`
   *     );
   *     const githubUser = await githubResponse.json();
   *     // show the avatar
   *     const img = document.createElement('img');
   *     img.src = githubUser.avatar_url;
   *     // wait 3 seconds
   *     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
   *     img.remove();
   *   },
   *   {},
   *   username
   * );
   * ```
   *
   * @param pageFunction - Function to be evaluated in browser context until it returns a
   * truthy value.
   * @param options - Options for configuring waiting behavior.
   */
  waitForFunction<
      Params extends unknown[],
      Func extends EvaluateFunc<Params> = EvaluateFunc<Params>,
  >(
      pageFunction: Func | string,
      options?: FrameWaitForFunctionOptions,
      ...args: Params
  ): Promise<HandleFor<Awaited<ReturnType<Func>>>>;

  waitForDevicePrompt(
      options?: WaitTimeoutOptions
  ): Promise<DeviceRequestPrompt>;
}
