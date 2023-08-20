import { ValueType } from './ds';
import { Page } from './page';

/**
 * Script template which is used to combine/generate the script.
 */
export interface WebCrawlerScriptTemplate {
  /**
   * name of the template
   */
  name: string;

  /**
   * text of the script template
   */
  text: string;

  /**
   * Make a script from the template
   */
  getScript(): WebCrawlerScript;

  /**
   * Return script text to show to the user
   */
  getScriptText(): string;

  /**
   * Some script templates may contain URL in itself,
   * this method extracts it from the template
   */
  getUrl(): string | undefined;

  /**
   * Set URL to the script template
   * @param url URL
   */
  setUrl(url: string): void;

  /**
   * Modify script, for example by adding template parameters.
   * Normally it's adding a selector, which is supposed to be
   * the first argument, extra arguments can be field names etc.,
   * and are provided by user input.
   */
  [key: `$${string}`]: (...args: string[]) => void;
}

export interface WebCrawlerScript {

  /**
   * Script execution method which is called to get the data
   * @param page
   */
  execute(page: Page): Promise<ValueType[][]>;
}