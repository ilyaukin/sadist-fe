/**
 * an "interface" for ds providers;
 * inherit all providers from it
 */
import React from "react";

class NullProvider {
  type = undefined;

  text = undefined;

  icon = undefined;

  renderDetails() {
    return <br />;
  }

  /**
   * load CSV from the source;
   * must return Promise<{csv: <csv content as blob>,
   * filename: <csv file name>,
   * type: <source type>, extra: <any extra data dict>}>
   */
  loadCSV() {
    throw new Error('Override me!');
  }

}

export default NullProvider;
