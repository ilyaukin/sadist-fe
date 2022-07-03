import React, { useContext, useEffect, useRef, useState } from 'react';
import Loader from '../common/Loader';
import anon from '~/img/anon.png';
import Dropdown from '../common/Dropdown';
import WiredListbox from '../common/WiredListbox';
import WiredItem from '../common/WiredItem';
import UserLoginDialog from './UserLoginDialog';
import UserContext from '../../context/UserContext';
import { isVal } from '../../helper/wired-helper';

const UserDropdown = () => {
  const userContext = useContext(UserContext);
  const dropdownRef = useRef();

  const {
    user, loading, isLogin, isLogout, isLoginDialogOpen,
    whoami, logout, openLoginDialog, closeLoginDialog
  } = userContext;

  useEffect(() => {
    whoami();
  }, []);

  const onLogin = () => {
    openLoginDialog();
    dropdownRef.current.collapse();
  }

  const onLogout = () => {
    logout();
    dropdownRef.current.collapse();
  }

  const onMenu = (event) => {
    const value = event.detail.selected;
    switch (value) {
      case 'login':
        onLogin();
        break;
      case 'logout':
        onLogout();
        break;
    }
  }

  return <>
    <UserLoginDialog
      open={isVal(isLoginDialogOpen)}
      onCancel={closeLoginDialog}
    />
    <Dropdown
      ref={dropdownRef}
      className="user-dropdown"
      toggle={
        <div className="user-dropdown-icon">
          <Loader loading={loading || isLogin || isLogout}/>
          <img
            src={user.avatar || anon}
            alt={user.name || 'anon'}
          />
        </div>
      }
      content={
        <WiredListbox onSelected={onMenu}>
          {user.type === 'anon' ?
            <WiredItem value="login">Login</WiredItem> :
            <WiredItem value="logout">Logout</WiredItem>
          }
        </WiredListbox>
      }
    />
  </>
}

export default UserDropdown;
