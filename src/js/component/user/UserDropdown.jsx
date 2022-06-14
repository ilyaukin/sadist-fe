import React, { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import anon from '~/img/anon.png';
import Dropdown from '../common/Dropdown';
import WiredListbox from '../common/WiredListbox';
import WiredItem from '../common/WiredItem';

const UserDropdown = () => {
  //todo consider change to useReducer
  const [state, setState] = useState({
    loading: true,
    user: { type: 'anon', }
  });

  useEffect(() => {
    const { loading } = state;
    if (loading) {
      fetch('/user/whoami').then((response) => {
        response.json().then(data => {
          if (data.success) {
            setState({ loading: false, open: false, user: data.user });
          }
        });
      });
    }
  }, [state.loading]);

  const { loading, user } = state;

  return <Dropdown
    className="user-dropdown"
    toggle={[
      <Loader loading={loading}/>,
      <img
        src={user.avatar || anon}
        alt={user.name || 'anon'}
      />
    ]}
    content={
      <WiredListbox>
        {user.type === 'anon' ?
          <WiredItem value="login">Login</WiredItem> :
          <WiredItem value="logout">Logout</WiredItem>
        }
      </WiredListbox>
    }
  />
}

export default UserDropdown;
