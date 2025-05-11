import React, { useEffect, useRef, useState } from 'react';
import { WiredDialog } from '/wired-elements/lib/wired-dialog';
import Icon from "../../icon/Icon";
import { useHotkeys } from '../../hook/hotkey-hook';

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
  let { open, onClose, children, buttons } = props;
  const [isFull, setFull] = useState(false);

  const dialogRef = useRef<WiredDialog | null>(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current?.requestUpdate();
    }
  }, [open]);

  useHotkeys(dialogRef, [{
    key: 'Alt+Enter',
    title: 'Full screen',
    callback: () => {
      setFull(full => !full);
    },
  }, {
    key: 'Escape',
    title: 'Close dialog',
    callback: onClose,
  }], [isFull]);

  const style: React.CSSProperties = {};
  if (isFull) {
    // minus padding of wired-card which incorporates the content
    style.height = 'calc(100vh - 20px)';
    style.width = 'calc(100vw - 20px)';
  }

  return <wired-dialog ref={dialogRef} {...props}>
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
