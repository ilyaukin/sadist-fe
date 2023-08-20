import React, { useState } from 'react';
import { WiredDialog } from '/wired-elements/lib/wired-dialog';
import Icon from "../../icon/Icon";

export enum DialogButton {
  CLOSE,
  FULL,
}

interface DialogProps extends React.HTMLProps<WiredDialog> {
  elevation?: number;
  open: boolean | undefined;
  buttons: DialogButton[];
  onClose: () => any;
  children: any;
}

const Dialog: React.FC<DialogProps> = (props: DialogProps) => {
  let { onClose, children, buttons } = props;
  const [isFull, setFull] = useState(false);

  const style: React.CSSProperties = {};
  if (isFull) {
    style.height = '100vh';
    style.width = '100vw';
  }

  return <wired-dialog {...props}>
    <div key="content" className="dialog-content" style={style}>
      {children}
    </div>
    <div key="buttons" className="dialog-icon-pane">
      {
        buttons.map(b => {
          switch (b) {
            case DialogButton.CLOSE:
              return <img
                  key="close"
                  className="dialog-icon"
                  src={Icon.cross}
                  alt="Close"
                  onClick={onClose}
              />
            case DialogButton.FULL:
              return <img
                  key="full"
                  className="dialog-icon"
                  src={isFull ? Icon.fullScreenOff : Icon.fullScreenOn}
                  alt="Full Screen"
                  onClick={() => setFull(full => !full)}
              />
            default:
              return null;
          }
        })
      }
    </div>
  </wired-dialog>
}

Dialog.defaultProps = {
  buttons: [DialogButton.CLOSE],
}

export default Dialog;
