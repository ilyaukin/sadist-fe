import React, { Component } from "react";
import PropTypes from "prop-types";
import "wired-spinner";

export class Loader extends Component {
  render() {
    return this.props.loading ? <wired-spinner spinning id="loader"/> : "";
  }
}

Loader.propTypes = { loading: PropTypes.bool };

export default Loader;
