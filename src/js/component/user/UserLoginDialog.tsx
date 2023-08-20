import React from 'react';
import Dialog from '../common/Dialog';
import GoogleLoginButton from './GoogleLoginButton';

interface UserLoginDialogProps {
  open: boolean | undefined;
  onCancel: () => any;
}

const UserLoginDialog = ({ open, onCancel }: UserLoginDialogProps) => {

  return <Dialog open={open} onClose={onCancel}>
    <span className="hint-title">Why to log in?</span>
    <p>Login allows you to upload private data sheets, manage sheets access, and
      many many more</p>
    <GoogleLoginButton/>
  </Dialog>
}

export default UserLoginDialog;
