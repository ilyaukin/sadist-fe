import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '/packages/wired-dialog';
import '/packages/wired-card';
import '/packages/wired-button';

class ErrorDialog extends Component {
  // will be overwritten by SPA
  static raise = (err) => {
  };
  static close = () => {
  };

  render() {
    const { err } = this.props;
    return (
      <div>
        <wired-dialog open={err} id="error-dialog">
          <wired-card elevation="3" fill="darkred">
            {err}
          </wired-card>

          <wired-button
            style={{ margin: '10px' }}
            id="closeDialog"
            onClick={() => ErrorDialog.close()}>Close
          </wired-button>
        </wired-dialog>
      </div>
    );
  }
}

ErrorDialog.props = {
  err: PropTypes.string
}

export default ErrorDialog;
