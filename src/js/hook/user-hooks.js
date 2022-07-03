import { signIn, signOut } from '../helper/gapi-helper';


/**
 * Return a function to retrieve current user from our application
 * @param startWhoami the function that is called before
 * @param onSuccess success callback, accepts user
 * @param onFailure error callback
 * @return {(function(): void)|*}
 */
export const useWhoami = ({ startWhoami, onSuccess, onFailure }) => {
  const whoami = function whoami() {
    startWhoami();
    fetch('/user/whoami').then((response) => {
      response.json().then(data => {
        if (data.success) {
          onSuccess(data.user);
        }
      }).catch(e => onFailure('Error parsing json: ' + e.toString()));
    }).catch(e => onFailure('Error connecting to the server: ' + e.toString()));
  }
  whoami.onSuccess = onSuccess;
  whoami.onFailure = onFailure;
  return whoami;
}

/**
 * Return a function to login to our own application
 * @param onSuccess {function(*): void} callback on successful login, accepts user
 * @param onFailure {function(*): void} callback on error
 * @return {(function(*): void)|*}
 */
export const useLoginInternal = ({ onSuccess, onFailure }) => {
  const loginInternal = function loginInternal(user) {
    fetch('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    }).then(response => {
      response.json().then(data => {
        if (data.success) {
          onSuccess(data.user);
        } else {
          onFailure(`Error login to the app: ${data.error || 'Unknown error'}`);
        }
      }).catch(e => onFailure('Error parsing json ' + e.toString()));
    }).catch(e => onFailure('Error connecting the server: ' + e.toString()));
  }
  loginInternal.onSuccess = onSuccess;
  loginInternal.onFailure = onFailure;
  return loginInternal;
}

/**
 * Return a function to logout from our own application
 * @param onSuccess {function(*): void} callback on successful logout, accepts user
 * @param onFailure {function(*): void} callback on error
 * @return {(function())|*}
 */
export const useLogoutInternal = ({ onSuccess, onFailure }) => {
  const logoutInternal = function () {
    fetch('/user/logout', { method: 'POST' }).then((response) => {
      response.json().then(data => {
        if (data.success) {
          onSuccess(data.user);
        } else {
          onFailure('Error connecting the server: ' + data.error || 'Unknown error');
        }
      }).catch(e => {
        onFailure('Error parsing json: ' + e.toString());
      });
    }).catch(e => {
      onFailure('Error logging out from the app: ' + e.toString());
    });
  };
  logoutInternal.onSuccess = onSuccess;
  logoutInternal.onFailure = onFailure;
  return logoutInternal;
}

/**
 * Return a login function for a user of given type
 * @param startLogin the function that is called before
 * @param type type of user
 * @param onSuccess call back on success login
 * @param onFailure call back on unsuccessful login
 * @returns {function(): () => void}
 */
export const useLogin = ({ startLogin, type, onSuccess, onFailure }) => {
  let signIn = useHook({ type, onSuccess, onFailure }).signIn;
  let login = () => {
    startLogin();
    signIn();
  };
  login.onSuccess = onSuccess;
  login.onFailure = onFailure;
  return login ;
};

/**
 * Return a logout function for a user of given type
 * @param startLogout {function(): void}the function that is called before
 * @param type type of a user
 * @param onSuccess callback on successful login
 * @param onFailure callback on unsuccessful login
 * @returns {function(): () => void}
 */
export const useLogout = ({ startLogout, type, onSuccess, onFailure }) => {
  let signOut = useHook({ type, onSuccess, onFailure }).signOut;
  let logout = () => {
    startLogout();
    signOut();
  };
  logout.onSuccess = onSuccess;
  logout.onFailure = onFailure;
  return logout;
}

const useHook = ({ type, onSuccess, onFailure }) => {
  const config = {
    "google": useGoogleHook({ onSuccess, onFailure }),
    "default": useDefaultHook({ type, onSuccess, onFailure }),
  };
  return config[type] || config["default"];
}

const useDefaultHook = ({ type, onSuccess, onFailure }) => ({
  signIn: () => onFailure(`${type} cannot sign in`),
  signOut: () => onFailure(`${type} cannot sign out`),
});

const useGoogleHook = ({ onSuccess, onFailure }) => ({
  signIn: () => signIn({ onSuccess, onFailure }),
  signOut: () => signOut({ onSuccess, onFailure }),
});
