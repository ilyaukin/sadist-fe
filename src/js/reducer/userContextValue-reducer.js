export const defaultUserContextValue = {
  user: { type: 'anon', },
  loading: false,  // loading current user in progress
  isLogin: false,  // login in progress
  isLogout: false,  // logout in progress
  isLoginDialogOpen: false, // login dialog is shown to the user
}

export const reduceUserContextValue = (value, action) => {
  switch (action.type) {
    case userActionType.WHOAMI_START:
      return { ...value, loading: true };
    case userActionType.WHOAMI_SUCCCESS:
      return { ...value, user: action.user, loading: false };
    case userActionType.WHOAMI_FAIL:
      return { ...value, loading: false };
    case userActionType.LOGIN_DIALOG_OPEN:
      return { ...value, isLoginDialogOpen: true };
    case userActionType.LOGIN_DIALOG_CANCEL:
      return { ...value, isLoginDialogOpen: false };
    case userActionType.LOGIN_START:
      return { ...value, isLogin: true };
    case userActionType.LOGIN_SUCCESS:
      return { ...value, user: action.user, isLogin: false, isLoginDialogOpen: false };
    case userActionType.LOGIN_FAIL:
      return { ...value, isLogin: false };
    case userActionType.LOGOUT_START:
      return { ...value, isLogout: true };
    case userActionType.LOGOUT_SUCCESS:
      return { ...value, user: action.user, isLogout: false };
    case userActionType.LOGOUT_FAIL:
      return { ...value, isLogout: false };
  }
  console.log(`The action ${action.type} cannot be dispatched, stay with the same state`);
  return value;
}

export const userActionType = {
  WHOAMI_START: 'WHOAMI_START',
  WHOAMI_SUCCCESS: 'WHOAMI_SUCCESS',
  WHOAMI_FAIL: 'WHOAMI_FAIL',
  LOGIN_DIALOG_OPEN: 'LOGIN_DIALOG_OPEN',
  LOGIN_DIALOG_CANCEL: 'LOGIN_DIALOG_CANCEL',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT_START: 'LOGOUT_START',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_FAIL: 'LOGOUT_FAIL',
}
