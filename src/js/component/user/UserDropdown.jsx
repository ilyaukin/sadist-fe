import React, { useEffect, useRef, useState } from 'react';
import Loader from '../common/Loader';
import anon from '~/img/anon.png';
import Dropdown from '../common/Dropdown';
import WiredListbox from '../common/WiredListbox';
import WiredItem from '../common/WiredItem';
import UserLoginDialog from './UserLoginDialog';
import ErrorDialog from '../common/ErrorDialog';
import { useLogout } from '../../helper/user-hooks';
import { isVal } from '../../helper/wired-helper';

const UserDropdown = () => {
  //todo consider change to useReducer
  const [state, setState] = useState({
    loading: true,
    user: { type: 'anon', },
    isLogin: false,  // login in progress
    isLogout: false,  // logout in progress
  });
  const dropdownRef = useRef();

  const logoutInternal = () => {
    fetch('/user/logout', { method: 'POST' }).then((response) => {
      response.json().then(data => {
        if (data.success) {
          setState({ ...state, isLogout: false, user: data.user });
        } else {
          setState({ ...state, isLogout: false });
          ErrorDialog.raise('Error connecting the server: ' + data.error || 'Unknown error');
        }
      }).catch(e => {
        setState({ ...state, isLogout: false });
        ErrorDialog.raise('Error parsing json: ' + e.toString());
      });
    }).catch(e => {
      setState({ ...state, isLogout: false });
      ErrorDialog.raise('Error logging out from the app: ' + e.toString());
    });
  };

  const logout = useLogout({
    type: state.user.type,
    onSuccess: logoutInternal,
    onFailure: (e) => {
      setState({ ...state, isLogout: false });
      ErrorDialog.raise(e.toString());
    }
  });

  useEffect(() => {
    const { loading } = state;
    if (loading) {
      fetch('/user/whoami').then((response) => {
        response.json().then(data => {
          if (data.success) {
            setState({ ...state, loading: false, user: data.user });
          }
        });
      });
    }
  }, [state.loading]);

  useEffect(() => {
    const { isLogout } = state;
    if (isLogout) {
      logout();
    }
  }, [state.isLogout]);

  const onLogin = () => {
    setState({ ...state, isLogin: true });
    dropdownRef.current.collapse();
  }

  const onLoginCancel = () => {
    setState({ ...state, isLogin: false });
  }

  const onLoginSuccess = (user) => {
    setState({ ...state, user: user, isLogin: false });
  }

  const onLogout = () => {
    setState({ ...state, isLogout: true });
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

  const { loading, user, isLogin, isLogout } = state;

  return <>
    <UserLoginDialog
      open={isVal(isLogin)}
      onCancel={onLoginCancel}
      onSuccess={onLoginSuccess}
    />
    <Dropdown
      ref={dropdownRef}
      className="user-dropdown"
      toggle={[
        <Loader loading={loading || isLogout}/>,
        <img
          src={user.avatar || anon}
          alt={user.name || 'anon'}
        />
      ]}
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
