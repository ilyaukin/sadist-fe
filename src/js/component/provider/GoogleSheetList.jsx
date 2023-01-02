import React, { useEffect, useState } from 'react';
import { checkAuth, listSheets } from '../../helper/gapi-helper';
import ErrorDialog from '../common/ErrorDialog';
import GoogleSheetListBlock from './GoogleSheetListBlock';
import Loader from '../common/Loader';
import UserLoginGoogleButton from '../user/UserLoginGoogleButton';
import { isVal } from '../../helper/wired-helper';
import WiredListbox from '../common/WiredListbox';
import WiredItem from '../common/WiredItem';

const GoogleSheetList = ({ onSheetSelected }) => {
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
    checkAuth({ onSuccess: setSignIn })
      .catch((e) => ErrorDialog.raise(`Error checking authorization: ${e.toString()}`));
  }, []);

  useEffect(() => {
    if (isSignIn) {
      setSheetState(s => ({ ...s, sheetsLoading: true }));
      listSheets()
        .then(sheets => setSheetState(s => ({ ...s, sheets, sheetsLoading: false })))
        .catch((e) => {
          setSheetState(s => ({ ...s, sheetsLoading: false, sheetsError: e }));
        });
    }
  }, [isSignIn]);

  if (isSignIn === undefined) {
    return <GoogleSheetListBlock><Loader loading={true}/></GoogleSheetListBlock>
  }

  if (!isSignIn) {
    // display login button
    return <UserLoginGoogleButton/>
  }

  const renderSheet = (sheet, i) => {
    return <WiredItem key={i} class="google-sheet-list-item" value={i}>
      {sheet.name}
    </WiredItem>;
  };

  const onSelected = (event) => {
    onSheetSelected(sheetState.sheets[parseInt(event.detail.selected)], event);
  }

  return <GoogleSheetListBlock>
    <Loader loading={isVal(sheetState.sheetsLoading)}/>
    {
      sheetState.sheetsError ?
        <span className="external-error">{sheetState.sheetsError}</span> :
        <WiredListbox class="google-sheet-list" onSelected={onSelected}>
          {sheetState.sheets.map(renderSheet)}
        </WiredListbox>
    }
  </GoogleSheetListBlock>
}

export default GoogleSheetList;
