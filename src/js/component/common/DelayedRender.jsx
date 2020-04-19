import React, { Component } from 'react';
import PropTypes from 'prop-types';


/**
 workaround to https://github.com/wiredjs/wired-elements/issues/114
 */
class DelayedRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToRender: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ readyToRender: true }), 1000);
  }

  render() {
    return this.state.readyToRender ?
      this.props.children :
      '';
  }
}

DelayedRender.propTypes = {
  children: PropTypes.node
};

export default DelayedRender;
