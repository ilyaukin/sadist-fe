import { signIn, signOut } from "../helper/gapi-helper";
import { UserAction, UserActionType } from '../reducer/userContextValue-reducer';
import { User, UserContextData, UserContextValue, UserType } from "../model/user";


/**
 * Extend a user context value by methods that allow log in, log out etc.
 * This object methods will be aware of consistence of the application
 * state by dispatching needed actions
 * How to use:
 * - call {@code useReducer} to generate current user context value
 * state and dispatcher function
 * - pass current state and the dispatcher to this hook
 * - pass resulting value to the context
 * - use {@code useContext} and call user methods when needed
 * @param userContextData {UserContextData} returned by useReducer
 * @param dispatchUserContextValue {function(UserAction):void} returned by useReducer
 */
export function useUserContextValue(userContextData: UserContextData, dispatchUserContextValue: (a: UserAction) => void): UserContextValue {
  // 1. generate methods for user login, logout etc.
  const startWhoami = () => dispatchUserContextValue({ type: UserActionType.WHOAMI_START });
  const successWhoami = (user: User) => {
    dispatchUserContextValue({ type: UserActionType.WHOAMI_SUCCCESS, user });
    return user;
  };
  const failWhoami = (e: any) => {
    dispatchUserContextValue({ type: UserActionType.WHOAMI_FAIL });
    throw e;
  };
  const startLogin = () => dispatchUserContextValue({ type: UserActionType.LOGIN_START });
  const successLogin = (user: User) => {
    dispatchUserContextValue({ type: UserActionType.LOGIN_SUCCESS, user });
    return user;
  };
  const failLogin = (e: any) => {
    dispatchUserContextValue({ type: UserActionType.LOGIN_FAIL });
    throw e;
  };
  const startLogout = () => dispatchUserContextValue({ type: UserActionType.LOGOUT_START });
  const successLogout = (user: User) => {
    dispatchUserContextValue({ type: UserActionType.LOGOUT_SUCCESS, user });
    return user;
  };
  const failLogout = (e: any) => {
    dispatchUserContextValue({ type: UserActionType.LOGOUT_FAIL });
    throw e;
  }
  const loginInternal = useLoginInternal();
  const logoutInternal = useLogoutInternal();
  const whoami = useWhoami();
  const loginGoogle = useLogin({ type: "google" });
  const logout = useLogout({ type: userContextData.user.type });
  const openLoginDialog = () => dispatchUserContextValue({ type: UserActionType.LOGIN_DIALOG_OPEN });
  const closeLoginDialog = () => dispatchUserContextValue({ type: UserActionType.LOGIN_DIALOG_CANCEL });

  // 2. combine these methods with state management methods
  // and put them together with user context value
  return {
    ...userContextData,
    whoami: function () {
      startWhoami();
      return whoami()
        .then(successWhoami)
        .catch(failWhoami);
    },
    loginGoogle: function () {
      startLogin();
      return loginGoogle()
        .then(loginInternal)
        .then(successLogin)
        .catch(failLogin);
    },
    logout: function () {
      startLogout();
      return logout()
        .then(logoutInternal)
        .then(successLogout)
        .catch(failLogout);
    },
    openLoginDialog,
    closeLoginDialog,
  }
}

/**
 * Return a function to retrieve current user from our application
 * @return {function(): Promise<*>}
 */
const useWhoami = () => {
  return function (): Promise<User> {
    return fetch('/user/whoami')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          return data.user;
        }
        throw data.error || 'Unknown error';
      });
  };
}

/**
 * Return a function to login to our own application
 * @return {function(*): Promise<*>}
 */
const useLoginInternal = () => {
  return function (user: User): Promise<User> {
    return fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    }).then(response => response.json())
      .then(data => {
        if (data.success) {
          return data.user;
        } else {
          throw `Error login to the app: ${data.error || 'Unknown error'}`;
        }
      });
  };
}

/**
 * Return a function to logout from our own application
 * @return {function(): Promise<>}
 */
const useLogoutInternal = () => {
  return function (): Promise<User> {
    return fetch('/user/logout', { method: 'POST' })
      .then((response) => response.json())
      .then(data => {
        if (data.success) {
          return data.user;
        } else {
          throw 'Error logging out from the app: ' + data.error || 'Unknown error';
        }
      })
  };
}

/**
 * Return a login function for a user of given type
 * @param type type of user
 * @returns {function(*): Promise<*>}
 */
const useLogin = ({ type }: UserTypeType) => {
  return useHook({ type }).signIn;
};

/**
 * Return a logout function for a user of given type
 * @param type type of a user
 * @returns {function(): Promise<>}
 */
const useLogout = ({ type }: UserTypeType) => {
  return useHook({ type }).signOut;
}

const useHook = ({ type }: UserTypeType) => {
  const config: UserHookMap = {
    "google": useGoogleHook(),
    "default": useDefaultHook({ type }),
  };
  return config[type] || config["default"];
}

const useDefaultHook = ({ type }: UserTypeType): UserHookType => ({
  signIn: () => new Promise((_resolve, reject) => reject(`${type} cannot sign in`)),
  signOut: () => new Promise((_resolve, reject) => reject(`${type} cannot sign in`)),
});

const useGoogleHook = (): UserHookType => ({
  signIn,
  signOut,
});

type UserTypeType = { type: UserType };
type UserHookType = { signIn: () => Promise<User>, signOut: () => Promise<void> };
type UserHookMap = { [k: string]: UserHookType };
