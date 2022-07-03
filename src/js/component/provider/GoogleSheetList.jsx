import React, { useEffect, useState } from 'react';
import { checkAuth, listSheets } from '../../helper/gapi-helper';
import ErrorDialog from '../common/ErrorDialog';
import GoogleSheetListBlock from './GoogleSheetListBlock';
import Loader from '../common/Loader';
import UserLoginGoogleButton from '../user/UserLoginGoogleButton';
import { isVal } from '../../helper/wired-helper';

const GoogleSheetList = () => {
  // 3 states are possible here: undefined (query in progress),
  // false (not signed in), true (signed in)
  const [isSignIn, setSignIn] = useState();

  // list of Google Sheets objects
  const [sheetState, setSheetState] = useState({
    sheets: [],
    sheetsLoading: false,
    sheetsError: undefined,
  });

  useEffect(() => {
    checkAuth({
      onSuccess: setSignIn,
      onFailure: (error) => ErrorDialog.raise(`Error checking authorization: ${error.toString()}`),
    });
  }, []);

  useEffect(() => {
    if (isSignIn) {
      setSheetState(s => ({ ...s, sheetsLoading: true }));
      listSheets({
        onSuccess: sheets => setSheetState(s => ({ ...s, sheets, sheetsLoading: false })),
        onFailure: (e) => {
          setSheetState(s => ({ ...s, sheetsLoading: false, sheetsError: e }));
        },
      }).then(() => console.log('listSheets finished')).catch(() => console.log('listSheets fail'));
    }
  }, [isSignIn]);

  if (isSignIn === undefined) {
    return <GoogleSheetListBlock><Loader loading={true}/></GoogleSheetListBlock>
  }

  if (!isSignIn) {
    // display login button
    return <UserLoginGoogleButton/>
  }

  return <GoogleSheetListBlock>
    <Loader loading={isVal(sheetState.sheetsLoading)}/>
    {
      sheetState.sheetsError ?
        <span className="external-error">{sheetState.sheetsError}</span> :
        sheetState.sheets.map(sheet => <a href="#">{sheet.name}</a>)
    }
  </GoogleSheetListBlock>
}

export default GoogleSheetList;
