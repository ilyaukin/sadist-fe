import React from 'react';
import '../../css/index.scss';
import ErrorDialog from './common/ErrorDialog';
import UserDropdown from './user/UserDropdown';
import DsList from './ds/DsList';
import DsTable from './ds/DsTable';
import Visualization from './visualization/Visualization';
import Splitter from './common/Splitter';
import UserContext from '../context/UserContext';
import { renderPage } from '../helper/react-helper';
import { buildDsInfo, dsInfoActionType, reduceDsInfo } from '../reducer/dsInfo-reducer';
import { useLogin, useLoginInternal, useLogout, useLogoutInternal, useWhoami } from '../hook/user-hooks';
import { defaultUserContextValue, reduceUserContextValue, userActionType } from '../reducer/userContextValue-reducer';

const SPA = () => {

  const [err, setErr] = React.useState();
  const [userContextValue, dispatchUserContextValue] = React.useReducer(reduceUserContextValue, defaultUserContextValue);
  const [ds, setDs] = React.useState([]);
  const [dsInfo, dispatchDsInfo] = React.useReducer(reduceDsInfo, buildDsInfo());
  const [tableContentHeight, setTableContentHeight] = React.useState(
    Math.min(300, Math.max(100, Math.floor(window.innerHeight / 3))));

  ErrorDialog.raise = setErr;
  ErrorDialog.close = () => setErr(undefined);

  // extend userContextValue with some useful methods
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
  const loginInternal = useLoginInternal({ onSuccess: successLogin, onFailure: failLogin });
  const logoutInternal = useLogoutInternal({ onSuccess: successLogout, onFailure: failLogout });
  const whoami = useWhoami({ startWhoami, onSuccess: successWhoami, onFailure: failWhoami });
  const loginGoogle = useLogin({ startLogin, type: "google", onSuccess: loginInternal, onFailure: failLogout });
  const logout = useLogout({ startLogout, type: userContextValue.user.type, onSuccess: logoutInternal, onFailure: failLogout });
  const openLoginDialog = () => dispatchUserContextValue({ type: userActionType.LOGIN_DIALOG_OPEN });
  const closeLoginDialog = () => dispatchUserContextValue({ type: userActionType.LOGIN_DIALOG_CANCEL });
  const userContextValueEx = {
    ...userContextValue,
    whoami,
    loginGoogle,
    logout,
    openLoginDialog,
    closeLoginDialog,
  }

  const getTitle = function () {
    const titles = [
      'My handicapped pet project....',
      'Let steal the beggars!',
    ];
    const choose = Math.floor(Math.random() * titles.length);
    return titles[choose];
  };

  const renderVisualization = function () {
    if (!dsInfo.meta.id) {
      return '';
    }

    return <div>
      <Splitter onSplit={(delta) => setTableContentHeight(tableContentHeight + delta)}/>

      <h2>2. Visualize</h2>
      <Visualization
        dsId={dsInfo.meta.id}
        dsInfo={dsInfo}
        dispatchDsInfo={dispatchDsInfo}
      />
    </div>;
  };

  return <div className="content">
    <UserContext.Provider value={userContextValueEx}>
      <ErrorDialog err={err}/>

      <UserDropdown/>
      <h1>
        {getTitle()}
      </h1>
      <wired-divider/>

      <h2>1. Get the data</h2>
      {/*list existing data source using /ls api*/}
      <DsList onDsSelected={(meta) => dispatchDsInfo({
        type: dsInfoActionType.SELECT_DS,
        meta
      })}/>
      {/*show top from selected ds*/}
      <DsTable
        tableContentHeight={tableContentHeight}
        dsId={dsInfo.meta.id}
        dsInfo={dsInfo}
        dispatchDsInfo={dispatchDsInfo}
        onLoadDs={setDs}
        ds={ds}
      />

      {renderVisualization()}
    </UserContext.Provider>
  </div>;
};

export default SPA;

renderPage(<SPA/>);
