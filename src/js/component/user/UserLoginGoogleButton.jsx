import React, { useContext } from 'react';
import GoogleLoginImage from '~/img/g-login.png'
import UserContext from '../../context/UserContext';

const UserLoginGoogleButton = () => {

  const userContext = useContext(UserContext);
  let { loginGoogle } = userContext;

  return <div className="google-login-button" onClick={loginGoogle}>
    <img style={{maxWidth: "100%"}} src={GoogleLoginImage} alt="Login via Google"/>
  </div>

}

export default UserLoginGoogleButton
