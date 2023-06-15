import React, { useEffect, useState } from 'react';
import { checkAuth, listSheets } from '../../helper/gapi-helper';
import ErrorDialog from '../common/ErrorDialog';
import GoogleSheetListBlock from './GoogleSheetListBlock';
import Loader from '../common/Loader';
import GoogleLoginButton from '../user/GoogleLoginButton';

interface GoogleSheetListProps {
  onSheetSelected: (sheet: gapi.client.drive.File, event: CustomEvent) => void;
}

interface SheetState {
  sheets: gapi.client.drive.File[];
  sheetsLoading: boolean;
  sheetsError?: string;
}

const GoogleSheetList = ({ onSheetSelected }: GoogleSheetListProps) => {
  // 3 states are possible here: undefined (query in progress),
  // false (not signed in), true (signed in)
  const [isSignIn, setSignIn] = useState<boolean | undefined>();

  // list of Google Sheets objects
  const [sheetState, setSheetState] = useState<SheetState>({
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
    return <GoogleLoginButton/>
  }

  const renderSheet = (sheet: gapi.client.drive.File, i: number) => {
    return <wired-item key={i} className="google-sheet-list-item" value={`${i}`}>
      {sheet.name}
    </wired-item>;
  };

  const onSelected = (event: CustomEvent) => {
    onSheetSelected(sheetState.sheets[parseInt(event.detail.selected)], event);
  }

  return <GoogleSheetListBlock>
    <Loader loading={sheetState.sheetsLoading}/>
    {
      sheetState.sheetsError ?
        <span className="external-error">{sheetState.sheetsError}</span> :
        <wired-listbox className="google-sheet-list" onselected={onSelected}>
          {sheetState.sheets.map(renderSheet)}
        </wired-listbox>
    }
  </GoogleSheetListBlock>
}

export default GoogleSheetList;
