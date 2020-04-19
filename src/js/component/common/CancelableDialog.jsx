import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WiredDialog } from 'wired-dialog';
import Icon from "../Icon";

class CancelableDialog extends Component {
  render() {
    const { onCancel, children } = this.props;
    return <wired-dialog {...this.props}>
      {children}
      <img
          className="close-icon"
          src={Icon.cross}
          alt="Close"
          onClick={onCancel}
      />
    </wired-dialog>
  }
}

CancelableDialog.propTypes = {
  ...WiredDialog.propTypes,
  onCancel: PropTypes.func
}

export default CancelableDialog;
