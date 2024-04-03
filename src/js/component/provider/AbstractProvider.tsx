import React from "react";

/**
 * Props which providers will be created with
 */
export interface ProviderProps {
  /**
   * method that forcebly updates provider's screens
   */
  onUpdateScreens?: () => void;
}

/**
 * format of the resulting DS
 */
export interface ProvidedDs {
  csv: Blob;
  filename?: string;
  type: string;
  extra?: object;
}

/**
 * a base class for ds providers;
 * inherit all providers from it
 */
class AbstractProvider {
  /**
   * type of provider, a unique key
   * @type {String}
   */
  type?: string = undefined;

  /**
   * text of provider in drop-down
   * @type {String}
   */
  text?: string = undefined;

  /**
   * Icon of provider in drop-down
   * @type {JSX.Element}
   */
  icon?: string = undefined;

  protected props: ProviderProps;

  constructor(props: ProviderProps) {
    this.props = props;
  }

  /**
   * render description of provider, shown when a user
   * chooses that provider in drop-down
   * @returns {JSX.Element|string}
   */
  renderDescription(): JSX.Element | string | null {
    return `TODO add description for ${this.type}`;
  }

  /**
   * render screens of the provider, which are steps that a user
   * uses to fill provider's parameters.
   * The first screen will be shown at the right pane,
   * the rest of the screens will be shown in New DS dialog
   * by clicking "Next"
   * @returns {JSX.Element[]}
   */
  renderScreens(): JSX.Element[] {
    return [<br/>];
  }

  /**
   * validate screen number `i`
   * @param _i {number} screen positional number
   * @returns {Promise<*>} promise that resolves if screen is OK
   * and rejects if it is not OK
   */
  validate(_i: number): Promise<any> {
    throw new Error('Override me!');
  }

  /**
   * load CSV from the source;
   * @return {Promise<ProvidedDs>}
   * must return Promise<{csv: <csv content as blob>,
   * filename: <csv file name>,
   * type: <source type (may or may not be equal to `this.type`)>,
   * extra: <any extra data dict>}>
   */
  loadCSV(): Promise<ProvidedDs> {
    throw new Error('Override me!');
  }

}

export default AbstractProvider;
