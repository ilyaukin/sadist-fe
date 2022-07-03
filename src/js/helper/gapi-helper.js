import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_DISCOVERY_DOCS, GOOGLE_SCOPE } from './consts';
import { gapi } from 'gapi-script';
import { string } from 'prop-types';

/**
 * Check if a user is authorized in Google
 * @param onSuccess {function(boolean): void} callback if
 * check is success, will be
 * called with boolean (if logged in or not).
 * Can be called multiple times when authorization
 * status changes, so be aware of repetitive call. Basically,
 * only things like state update should be passed as a callback.
 * @param onFailure {function(*): void} callback if check failed
 */
export const checkAuth = ({ onSuccess, onFailure }) => {
  let doCheckAuth = () => {
    gapi.auth2.getAuthInstance().isSignedIn.listen(onSuccess);
    onSuccess(gapi.auth2.getAuthInstance().isSignedIn.get());
  };
  return loadAuth2().then(initClient).then(doCheckAuth).catch(onFailure);
};

/**
 * Sign in
 * @param onSuccess callback on successful login, accepts user
 * @param onFailure callback on error
 */
export const signIn = ({ onSuccess, onFailure }) => {
  let doSignIn = () => {

    //convert google User to internal user representation
    const g2i = googleUser => {
      console.log(googleUser);
      return {
        name: googleUser.getBasicProfile().getName(),
        avatar: googleUser.getBasicProfile().getImageUrl(),
        extra: {
          // here will be tokens to check a user, ID to match to
          // the existing users etc.
        }
      }
    }

    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    if (isSignedIn) {
      console.log('already signed in')
      const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
      onSuccess(g2i(googleUser));
    } else {
      gapi.auth2.getAuthInstance().signIn()
        .then(result => {
          onSuccess(g2i(result));
        })
        .catch(e => {
          const error = e.error; // error message in Google API
          if (error === 'popup_blocked_by_browser') {
            onFailure('Popup has been blocked by browser. Please allow popups and try again.');
          } else if (error) {
            onFailure(error)
          } else {
            onFailure(e);
          }
        });
    }
  };
  return loadAuth2().then(initClient).then(doSignIn).catch(onFailure);
}

/**
 * Sign out
 * @param onSuccess callback on successful logout
 * @param onFailure callback on error
 */
export const signOut = ({ onSuccess, onFailure }) => {
  let doSignOut = () => {
    const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    if (!isSignedIn) {
      console.log('already signed out');
      onSuccess();
    } else {
      gapi.auth2.getAuthInstance().signOut()
        .then(() => onSuccess())
        .catch(e => {
          const error = e.error;
          if (error) {
            onFailure(error);
          } else {
            onFailure(e);
          }
        });
    }
  };
  return loadAuth2().then(initClient).then(doSignOut).catch(onFailure);
}

/**
 * Get list of user's documents
 * @param onSuccess {function(Array): void} callback on file list
 * @param onFailure callback on failure
 */
export const listSheets = ({ onSuccess, onFailure }) => {
  let doListSheets = () => {
    gapi.client.drive.files.list({}).then(response => {
      onSuccess(response.result.files);
    }).catch((e) => {
      onFailure(errorToString(e));
    });
  };
  return loadDrive().then(initClient).then(doListSheets).catch(onFailure);
}


const initClient = () => {
  return gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    scope: GOOGLE_SCOPE,
    discoveryDocs: GOOGLE_DISCOVERY_DOCS,
  });
}

const loadModule = (module) => {
  return new Promise(resolve => gapi.load(module, resolve));
}

const loadClientModule = (module, version) => {
  return new Promise(resolve => gapi.client.load(module, version, resolve));
}

const loadAuth2 = () => {
  return loadModule('client:auth2');
}

const loadDrive = () => {
  return loadClientModule('drive', 'v2');
}

const errorToString =(e) => {
  //parse error returned from Google
  if (e.body && typeof e.body === 'string') {
    const body = JSON.parse(e.body);
    return body.error?.message || e.body;
  }
  return e.toString();
}