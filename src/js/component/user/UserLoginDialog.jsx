import React from 'react';
import GoogleLoginImage from '~/img/g-login.jpg';
import CancelableDialog from '../common/CancelableDialog';
import ErrorDialog from '../common/ErrorDialog';
import { useLogin } from '../../hook/user-hooks';

const UserLoginDialog = ({ open, onCancel, onSuccess }) => {

  const loginInternal = (user) => {
    fetch('/user/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ user })
    }).then(response => {
      response.json().then(data => {
        if (data.success) {
          onSuccess(data.user);
        } else {
          ErrorDialog.raise(`Error login to the app: ${data.error || 'Unknown error'}`);
        }
      }).catch(e => ErrorDialog.raise('Error parsing json ' + e.toString()));
    }).catch(e => ErrorDialog.raise('Error connecting the server: ' + e.toString()));
  }

  const loginGoogle = useLogin({
    type: "google",
    onSuccess: loginInternal,
    onFailure: e => ErrorDialog.raise("Error login to Google: " + e.toString())
  });

  return <CancelableDialog open={open} onCancel={onCancel}>
    <span className="hint-title">Why to log in?</span>
    <p>Login allows you to upload private data sheets, manage sheets access, and
    many many more</p>
    <div className="google-login-button" onClick={loginGoogle}>
      <img src={GoogleLoginImage} alt="Login via Google"/>
    </div>
  </CancelableDialog>
}

export default UserLoginDialog;
