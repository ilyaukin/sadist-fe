import React from 'react';
import Icon from "../../icon/Icon";

interface CancelableDialogProps {
  elevation?: number;
  open: boolean | undefined;
  onCancel: () => any;
  children: any;
}

const CancelableDialog = (props: CancelableDialogProps) => {
  const { onCancel, children } = props;
  return <wired-dialog {...props}>
    {children}
    <img
      className="close-icon"
      src={Icon.cross}
      alt="Close"
      onClick={onCancel}
    />
  </wired-dialog>
}

export default CancelableDialog;
