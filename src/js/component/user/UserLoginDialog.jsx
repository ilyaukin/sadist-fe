import React from 'react';
import CancelableDialog from '../common/CancelableDialog';
import UserLoginGoogleButton from './UserLoginGoogleButton';

const UserLoginDialog = ({ open, onCancel }) => {

  return <CancelableDialog open={open} onCancel={onCancel}>
    <span className="hint-title">Why to log in?</span>
    <p>Login allows you to upload private data sheets, manage sheets access, and
      many many more</p>
    <UserLoginGoogleButton/>
  </CancelableDialog>
}

export default UserLoginDialog;
