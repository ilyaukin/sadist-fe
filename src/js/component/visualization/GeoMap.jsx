import React, { Component } from "react";
import PropTypes from "prop-types";

export class GeoMap extends Component {
  render() {
    return <p>TODO: show at map {JSON.stringify(this.props.result)}</p>;
  }
}

GeoMap.propTypes = {
  result: PropTypes.array
};