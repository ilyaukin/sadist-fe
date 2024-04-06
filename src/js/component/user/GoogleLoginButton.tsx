import React, { useContext } from 'react';
import GoogleLoginImage from '~/img/g-login.png'
import ErrorDialog from '../common/ErrorDialog';
import Block from '../common/Block';
import UserContext from '../../context/UserContext';

const GoogleLoginButton = () => {

  const userContext = useContext(UserContext);
  const { loginGoogle } = userContext;
  const onLogin = () => {
    loginGoogle().catch(e => ErrorDialog.raise(e.toString()));
  }

  return <Block className="block google-login-button" onClick={onLogin}>
    <img style={{ maxWidth: "100%" }} src={GoogleLoginImage} alt="Login via Google"/>
  </Block>

}

export default GoogleLoginButton;
