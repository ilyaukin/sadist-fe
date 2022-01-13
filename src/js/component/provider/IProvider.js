import React from "react";

/**
 * an "interface" for ds providers;
 * inherit all providers from it
 */
class IProvider {
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

  /**
   * render description of provider, shown when a user
   * chooses that provider in drop-down
   * @type {JSX.Element|String}
   */
  renderDescription() {
    return `TODO add description for ${this.type}`;
  }

  /**
   * render details at the right pane
   * @returns {JSX.Element}
   */
  renderDetails() {
    return <br/>;
  }

  /**
   * load CSV from the source;
   * must return Promise<{csv: <csv content as blob>,
   * filename: <csv file name>,
   * type: <source type (may or may not be equal to `this.type`)>,
   * extra: <any extra data dict>}>
   */
  loadCSV() {
    throw new Error('Override me!');
  }

}

export default IProvider;
