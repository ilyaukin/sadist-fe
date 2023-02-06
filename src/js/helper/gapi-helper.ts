import { gapi } from 'gapi-script';
import { GOOGLE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_DISCOVERY_DOCS, GOOGLE_SCOPE } from './consts';
import { User } from "../model/user";

/**
 * Check if a user is authorized in Google
 * @param onSuccess {function(boolean): void} callback if
 * check is success, will be
 * called with boolean (if logged in or not).
 * Can be called multiple times when authorization
 * status changes, so be aware of repetitive call. Basically,
 * only things like state update should be passed as a callback.
 * @return {Promise<void>} immediately after check
 */
export const checkAuth = ({ onSuccess }: { onSuccess: (b: boolean) => any }) => {
  return loadAuth2()
    .then(initClient)
    .then(() => {
      gapi.auth2.getAuthInstance().isSignedIn.listen(onSuccess);
      onSuccess(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
};

/**
 * Sign in
 * @return {Promise<User>} user in ours format
 */
export const signIn = (): Promise<User> => {
  return loadAuth2()
    .then(initClient)
    .then(() => new Promise((resolve, reject) => {

      //convert google User to internal user representation
      const g2i = (googleUser: gapi.auth2.GoogleUser): User => {
        // console.log(googleUser);
        return {
          type: 'google',
          name: googleUser.getBasicProfile().getName(),
          avatar: googleUser.getBasicProfile().getImageUrl(),
          extra: {
            id: googleUser.getId(),
            auth: googleUser.getAuthResponse()
          }
        }
      }

      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        console.log('already signed in')
        const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
        resolve(g2i(googleUser));
      } else {
        gapi.auth2.getAuthInstance().signIn()
          .then(result => {
            resolve(g2i(result));
          })
          .catch(e => {
            const error = e.error; // error message in Google API
            if (error === 'popup_blocked_by_browser') {
              reject('Popup has been blocked by browser. Please allow popups and try again.');
            } else if (error) {
              reject(error)
            } else {
              reject(e);
            }
          });
      }
    }));
}

/**
 * Sign out
 */
export const signOut = (): Promise<void> => {
  return loadAuth2()
    .then(initClient)
    .then(() => new Promise<void>((resolve, reject) => {
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (!isSignedIn) {
        console.log('already signed out');
        resolve();
      } else {
        gapi.auth2.getAuthInstance().signOut()
          .then(() => resolve())
          .catch((e: any) => {
            const error = e.error;
            if (error) {
              reject(error);
            } else {
              reject(e);
            }
          });
      }
    }));
}

/**
 * Get list of user's documents of type spreadsheet
 */
export const listSheets = (): Promise<gapi.client.drive.File[]> => {
  return loadDrive()
    .then(initClient)
    .then(() => gapi.client.drive.files.list({
      orderBy: 'viewedByMeTime desc',
    }))
    .then(response => response.result.files!.filter(file => file.mimeType === 'application/vnd.google-apps.spreadsheet'))
    .catch(e => {
      throw errorToString(e);
    });
}

/**
 * Get sheet's content by using drive API, to get
 * more detailed information, including tabs etc., use
 * sheets API, e.g. {@link https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/get}
 * @param id {string} file's ID
 * @return {Promise<string>} string containing csv
 */
export const getSheetAsCsv = ({ id }: { id: string }): Promise<string> => {
  return loadDrive()
    .then(initClient)
    .then(() =>
      gapi.client.drive.files.export({
        fileId: id,
        mimeType: 'text/csv',
      }))
    .then(response => response.body)
    .catch(e => {
      throw errorToString(e);
    });
}

// *** private sector ***
const initClient = (): Promise<any> => {
  return gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    scope: GOOGLE_SCOPE,
    discoveryDocs: GOOGLE_DISCOVERY_DOCS,
  });
}

const loadModule = (module: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      gapi.load(module, resolve);
    } catch (e) {
      reject(e);
    }
  });
}

const loadClientModule = (module: string, version: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      // @ts-ignore
      gapi.client.load(module, version, resolve);
    } catch (e) {
      reject(e);
    }
  });
}

const loadAuth2 = (): Promise<any> => {
  return loadModule('client:auth2');
}

const loadDrive = (): Promise<any> => {
  return loadClientModule('drive', 'v3');
}

const errorToString = (e: any): string => {
  //parse error returned from Google
  if (e.body && typeof e.body === 'string') {
    const body = JSON.parse(e.body);
    return body.error?.message || e.body;
  }
  return e.toString();
}