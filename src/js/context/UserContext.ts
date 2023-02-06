import React from 'react';
import { UserContextValue } from "../model/user";

// suppress type check cos Usercontext is never used with default value
// @ts-ignore
const UserContext: React.Context<UserContextValue> = React.createContext({});

export default UserContext;
