import React from "react";

/**
 * a base class for ds providers;
 * inherit all providers from it
 */
class AbstractProvider {
  /**
   * type of provider, a unique key
   * @type {String}
   */
  type = undefined;

  /**
   * text of provider in drop-down
   * @type {String}
   */
  text = undefined;

  /**
   * Icon of provider in drop-down
   * @type {JSX.Element}
   */
  icon = undefined;

  constructor(props = {}) {
    this.props = props;
  }

  /**
   * render description of provider, shown when a user
   * chooses that provider in drop-down
   * @returns {JSX.Element|String}
   */
  renderDescription() {
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
  renderScreens() {
    return [<br/>];
  }

  /**
   * validate screen number {@code i}
   * @param i {number} screen positional number
   * @returns {Promise<*>} promise that resolves if screen is OK
   * and rejects if it is not OK
   */
  validate(i) {
    throw new Error('Override me!');
  }

  /**
   * load CSV from the source;
   * @return {Promise<{csv: Blob, filename: string, type: string, extra: Object}>}
   * must return Promise<{csv: <csv content as blob>,
   * filename: <csv file name>,
   * type: <source type (may or may not be equal to `this.type`)>,
   * extra: <any extra data dict>}>
   */
  loadCSV() {
    throw new Error('Override me!');
  }

}

export default AbstractProvider;
