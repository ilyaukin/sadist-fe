import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

/**
 * Helper component to display countdown clock
 */
class CountDownClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diff: props.to - moment()
    };
  }

  componentWillUnmount() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }

  leadSpace = (x) => {
    if (x < 10) {
      return `0${x}`;
    }
    return x;
  }

  tick = () => {
    const { to, onClockTimeout } = this.props;
    let diff = to - moment();

    if (diff < 0) {
      onClockTimeout();
      return;
    }

    this.setState({ diff });
  }

  render() {
    const { diff } = this.state;
    let t = Math.floor(diff / 1000);
    let s = t % 60, m = 0, h;
    t = Math.floor(t / 60);
    if (t > 0) {
      m = t % 60;
      h = Math.floor(t / 60);
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(this.tick, 1000);

    const delimiter = <span className="clock-delimiter">:</span>;

    return <span className="clock">
            {h ? [h, delimiter, this.leadSpace(m)] : [m]}
      {[delimiter, this.leadSpace(s)]}
        </span>
  }
}

CountDownClock.props = {
  to: PropTypes.instanceOf(moment),
  onClockTimeout: PropTypes.func
};

export default CountDownClock;
