import React, { Component } from 'react';
import WiredDialog from 'wired-dialog';
import WiredCard from 'wired-card';
import WiredButton from 'wired-button';

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
                <wired-dialog open={err}>
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

export default ErrorDialog;
