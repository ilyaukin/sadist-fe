/**
 * Page object which a script runs on. Provides an abstraction of
 * handling the page, such as navigation and information grabbing.
 */
export interface Page {
  /**
   * Current document of the page. Be aware that actions with it
   * such as clicking links can cause page reload and thus it's invalidation
   */
  document?: Document;

  /**
   * goto URL
   * @param url URL
   */
  goto(url: URL | string): Promise<Response>;

  /**
   * Normally, a shortcut for {@code document.documentElement.querySelector()}
   * @param selector css selector
   */
  querySelector(selector: string): Element | null;

  /**
   * Normally, a shortcut for {@code document.documentElement.querySelectorAll()}
   * @param selector
   */
  querySelectorAll(selector: string): Element[];
}