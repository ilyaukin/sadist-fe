import React from 'react';
import {
  defaultUserContextData,
  reduceUserContextData
} from '../../reducer/userContextValue-reducer';
import { useUserContextValue } from '../../hook/user-hooks';
import UserContext from '../../context/UserContext';

const UserContextProvider = ({ children }: React.ComponentProps<any>) => {
  let contextData = defaultUserContextData;
  let user = ( window as any ).data?.user;
  if (user) {
    contextData = { ...contextData, user, loaded: true };
  }
  const [userContextData, dispatchUserContextData] = React
      .useReducer(reduceUserContextData, contextData);

  const userContextValue = useUserContextValue(userContextData, dispatchUserContextData);

  return <UserContext.Provider value={userContextValue}>
    {children}
  </UserContext.Provider>
}

export default UserContextProvider;
