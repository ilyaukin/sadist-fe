import React, { Component } from "react";
import PropTypes from "proptypes";

export class Loader extends Component {
  render() {
    return this.props.loading ? <wired-spinner spinning id="loader"/> : "";
  }
}

Loader.propTypes = { loading: PropTypes.bool };

export default Loader;
