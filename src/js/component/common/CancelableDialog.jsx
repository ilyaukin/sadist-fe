import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '/packages/wired-dialog';
import Icon from "../../icon/Icon";

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
  elevation: PropTypes.number,
  open: PropTypes.bool,
  onCancel: PropTypes.func
}

export default CancelableDialog;
