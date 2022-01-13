import IProvider from "./IProvider";
import React from 'react';

class NullProvider extends IProvider {
  renderDescription() {
    return <span>&nbsp;</span>;
  }
}

export default NullProvider;

