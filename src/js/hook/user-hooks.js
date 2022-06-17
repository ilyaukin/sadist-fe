import { useGoogleLogin, useGoogleLogout } from 'react-google-login';

/**
 * Return a Login function for a user of given type
 * @param type type of user
 * @param onSuccess call back on success login
 * @param onFailure call back on unsuccessful login
 * @returns {function(): () => void}
 */
const useLogin = ({ type, onSuccess, onFailure }) => {
  return useHook({ type, onSuccess, onFailure }).signIn;
};

/**
 * Return a logout function for a user of given type
 * @param type type of a user
 * @param onSuccess callback on successful login
 * @param onFailure callback on unsuccessful login
 * @returns {function(): () => void}
 */
const useLogout = ({ type, onSuccess, onFailure }) => {
  return useHook({ type, onSuccess, onFailure }).signOut;
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

const GOOGLE_CLIENT_ID = '252961976632-l3s7f785he9psfk0fm5q33cvk4ssms7s.apps.googleusercontent.com';
const useGoogleHook = ({ onSuccess, onFailure }) => ({
  signIn: useGoogleLogin({
    onSuccess: (result) => {
      onSuccess({
        type: 'google',
        name: result.profileObj.name,
        avatar: result.profileObj.imageUrl,
        extra: result
      });
    },
    onFailure: (error) => {
      onFailure(error);
    },
    clientId: GOOGLE_CLIENT_ID,
    isSignedIn: true,
    accessType: 'online',
  }).signIn,
  signOut: useGoogleLogout({
    onLogoutSuccess: () => {
      onSuccess();
    },
    onFailure: (error) => {
      onFailure(error);
    },
    clientId: GOOGLE_CLIENT_ID,
  }).signOut,
});

export { useLogin, useLogout };
