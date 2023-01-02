import React from 'react';
import { defaultUserContextValue, reduceUserContextValue } from '../../reducer/userContextValue-reducer';
import { useUserContextValueEx } from '../../hook/user-hooks';
import UserContext from '../../context/UserContext';

const withUserContext = (WrappedComponent) => {
  return (...props) => {
    const [userContextValue, dispatchUserContextValue] = React
      .useReducer(reduceUserContextValue, defaultUserContextValue);

    const userContextValueEx = useUserContextValueEx(userContextValue, dispatchUserContextValue);

    return <UserContext.Provider value={userContextValueEx}>
      <WrappedComponent {...props}/>
    </UserContext.Provider>
  }
}

export default withUserContext;
