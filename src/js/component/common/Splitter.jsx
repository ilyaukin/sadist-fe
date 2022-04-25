import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '/packages/wired-divider';

/**
 * Divider which allows splitting areas by drag&drop
 */
class Splitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSplitting: false,
      delta: 0
    }
  }

  componentDidMount() {
    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    this.y = e.clientY;
    this.setState({ isSplitting: true });
  }

  onMouseMove = (e) => {
    if (this.state.isSplitting) {
      this.setState({ delta: e.clientY - this.y });
    }
  }

  onMouseUp = (e) => {
    if (this.state.isSplitting) {
      let delta = e.clientY - this.y;
      this.setState({ delta: 0, isSplitting: false }, () => {
        const { onSplit } = this.props;
        onSplit(delta);
      })
    }
  }

  render() {
    return <div
      ref={(container => this.container = container)}
      style={{ position: 'relative' }}
    >
      <div
        style={{
          cursor: 'ns-resize',
          position: 'absolute',
          left: 0,
          top: this.state.delta || 0
        }}
      >
        <wired-divider/>
      </div>
    </div>
  }
}

Splitter.propTypes = {
  onSplit: PropTypes.func
}

export default Splitter;
