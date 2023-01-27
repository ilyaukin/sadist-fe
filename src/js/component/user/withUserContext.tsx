import React from 'react';
import { defaultUserContextData, reduceUserContextData } from '../../reducer/userContextValue-reducer';
import { useUserContextValue } from '../../hook/user-hooks';
import UserContext from '../../context/UserContext';

const withUserContext = (WrappedComponent: any) => {
  return (...props: any[]) => {
    const [userContextData, dispatchUserContextData] = React
      .useReducer(reduceUserContextData, defaultUserContextData);

    const userContextValue = useUserContextValue(userContextData, dispatchUserContextData);

    return <UserContext.Provider value={userContextValue}>
      <WrappedComponent {...props}/>
    </UserContext.Provider>
  }
}

export default withUserContext;
