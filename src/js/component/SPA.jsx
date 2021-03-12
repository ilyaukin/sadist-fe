import '@webcomponents/custom-elements';
import React from 'react';
import DsList from './ds/DsList';
import './index.css';
import ErrorDialog from './common/ErrorDialog';
import DsTable from './ds/DsTable';
import Visualization from './visualization/Visualization';
import { renderPage } from '../helper/react-helper';
import Splitter from './common/Splitter';
import { buildDsInfo, actionType, reduceDsInfo } from '../reducer/dsInfo-reducer';

const SPA = () => {

  const [err, setErr] = React.useState();
  const [ds, setDs] = React.useState([]);
  const [dsInfo, dispatchDsInfo] = React.useReducer(reduceDsInfo, buildDsInfo());
  const [tableContentHeight, setTableContentHeight] = React.useState(
    Math.min(300, Math.max(100, Math.floor(window.innerHeight / 3))));

  ErrorDialog.raise = setErr;
  ErrorDialog.close = () => setErr(undefined);

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
    <ErrorDialog err={err}/>
    <h1>
      {getTitle()}
    </h1>
    <wired-divider/>

    <h2>1. Get the data</h2>
    {/*list existing data source using /ls api*/}
    <DsList onDsSelected={(meta) => dispatchDsInfo({
      type: actionType.SELECT_DS,
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
  </div>;
};

export default SPA;

renderPage(<SPA/>);
