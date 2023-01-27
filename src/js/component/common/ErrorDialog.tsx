import React, { Component } from 'react';
import { isVal } from "../../helper/wired-helper";

interface ErrorDialogProps {
  err: string | undefined;
}

class ErrorDialog extends Component<ErrorDialogProps> {
  // will be overwritten by SPA
  // @ts-ignore
  static raise = (err: string) => {
  };
  static close = () => {
  };

  render() {
    const { err } = this.props;
    return (
      <div>
        <wired-dialog open={isVal(err)} id="error-dialog">
          <wired-card elevation={3} fill="darkred">
            {err}
          </wired-card>

          <wired-button
            //@ts-ignore
            style={{ margin: '10px' }}
            id="closeDialog"
            onClick={() => ErrorDialog.close()}>Close
          </wired-button>
        </wired-dialog>
      </div>
    );
  }
}

export default ErrorDialog;
