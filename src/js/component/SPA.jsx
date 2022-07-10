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
import { buildDsInfo, defaultDsInfo, dsInfoActionType, reduceDsInfo } from '../reducer/dsInfo-reducer';
import { defaultUserContextValue, reduceUserContextValue } from '../reducer/userContextValue-reducer';
import { useUserContextValueEx } from '../hook/user-hooks';

const SPA = () => {

  const [err, setErr] = React.useState();
  const [userContextValue, dispatchUserContextValue] = React
    .useReducer(reduceUserContextValue, defaultUserContextValue);
  const [ds, setDs] = React.useState([]);
  const [dsInfo, dispatchDsInfo] = React.useReducer(reduceDsInfo, defaultDsInfo, buildDsInfo);
  const [tableContentHeight, setTableContentHeight] = React.useState(
    Math.min(300, Math.max(100, Math.floor(window.innerHeight / 3))));

  ErrorDialog.raise = setErr;
  ErrorDialog.close = () => setErr(undefined);

  const userContextValueEx = useUserContextValueEx(userContextValue, dispatchUserContextValue);

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
