import React from 'react';
import CancelableDialog from '../common/CancelableDialog';
import GoogleLoginButton from './GoogleLoginButton';

interface UserLoginDialogProps {
  open: boolean | undefined;
  onCancel: () => any;
}

const UserLoginDialog = ({ open, onCancel }: UserLoginDialogProps) => {

  return <CancelableDialog open={open} onCancel={onCancel}>
    <span className="hint-title">Why to log in?</span>
    <p>Login allows you to upload private data sheets, manage sheets access, and
      many many more</p>
    <GoogleLoginButton/>
  </CancelableDialog>
}

export default UserLoginDialog;
