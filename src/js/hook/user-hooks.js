import { signIn, signOut } from '../helper/gapi-helper';
import { userActionType } from '../reducer/userContextValue-reducer';
import ErrorDialog from '../component/common/ErrorDialog';


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
 * @param userContextValue {Object} returned by useReducer
 * @param dispatchUserContextValue {function} returned by useReducer
 */
export const useUserContextValueEx = (userContextValue, dispatchUserContextValue) => {
  // 1. generate methods for user login, logout etc.
  const startWhoami = () => dispatchUserContextValue({ type: userActionType.WHOAMI_START });
  const successWhoami = (user) => dispatchUserContextValue({ type: userActionType.WHOAMI_SUCCCESS, user });
  const failWhoami = (e) => dispatchUserContextValue({ type: userActionType.WHOAMI_FAIL });
  const startLogin = () => dispatchUserContextValue({ type: userActionType.LOGIN_START });
  const successLogin = (user) => dispatchUserContextValue({ type: userActionType.LOGIN_SUCCESS, user });
  const failLogin = (e) => {
    dispatchUserContextValue({ type: userActionType.LOGIN_FAIL });
    ErrorDialog.raise(e.toString());
  };
  const startLogout = () => dispatchUserContextValue({ type: userActionType.LOGOUT_START });
  const successLogout = (user) => dispatchUserContextValue({ type: userActionType.LOGOUT_SUCCESS, user });
  const failLogout = (e) => {
    dispatchUserContextValue({ type: userActionType.LOGIN_FAIL });
    ErrorDialog.raise(e.toString());
  }
  const loginInternal = useLoginInternal();
  const logoutInternal = useLogoutInternal();
  const whoami = useWhoami();
  const loginGoogle = useLogin({ type: "google" });
  const logout = useLogout({ type: userContextValue.user.type });
  const openLoginDialog = () => dispatchUserContextValue({ type: userActionType.LOGIN_DIALOG_OPEN });
  const closeLoginDialog = () => dispatchUserContextValue({ type: userActionType.LOGIN_DIALOG_CANCEL });

  // 2. combine these methods with state management methods
  // and put them together with user context value
  return {
    ...userContextValue,
    whoami: function () {
      startWhoami();
      return whoami()
        .then(successWhoami)
        .catch(failWhoami);
    },
    loginGoogle: function (user) {
      startLogin();
      return loginGoogle(user)
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
  return function () {
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
  return function (user) {
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
  return function () {
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
const useLogin = ({ type }) => {
  return useHook({ type }).signIn;
};

/**
 * Return a logout function for a user of given type
 * @param type type of a user
 * @returns {function(): Promise<>}
 */
const useLogout = ({ type }) => {
  return useHook({ type }).signOut;
}

const useHook = ({ type }) => {
  const config = {
    "google": useGoogleHook(),
    "default": useDefaultHook({ type }),
  };
  return config[type] || config["default"];
}

const useDefaultHook = ({ type }) => ({
  signIn: () => new Promise((resolve, reject) => reject(`${type} cannot sign in`)),
  signOut: () => new Promise((resolve, reject) => reject(`${type} cannot sign in`)),
});

const useGoogleHook = () => ({
  signIn,
  signOut,
});
