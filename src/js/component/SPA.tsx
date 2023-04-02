import React, { useRef } from 'react';
import '../../css/index.scss';
import './common/CustomElement';
import ErrorDialog from './common/ErrorDialog';
import UserDropdown from './user/UserDropdown';
import DsList from './ds/DsList';
import DsTable from './ds/DsTable';
import Viz, { VizElement } from './visualization/Viz';
import Splitter from './common/Splitter';
import withUserContext from './user/withUserContext';
import { defaultDsInfo, DsInfoActionType, reduceDsInfo } from '../reducer/dsInfo-reducer';
import { renderPage } from '../helper/react-helper';
import { DsMeta } from '../model/ds';

let SPA = () => {

  const [err, setErr] = React.useState<string>();
  const [ds, setDs] = React.useState<any[]>([]);
  const [dsInfo, dispatchDsInfo] = React.useReducer(reduceDsInfo, defaultDsInfo);
  const [tableContentHeight, setTableContentHeight] = React.useState(
    Math.min(300, Math.max(100, Math.floor(window.innerHeight / 3))));
  const [vizHeight, setVizHeight] = React.useState<number | undefined>();

  ErrorDialog.raise = setErr;
  ErrorDialog.close = () => setErr(undefined);

  const vizRef = useRef<VizElement | null>(null);

  const getTitle = function () {
    const titles = [
      'My handicapped pet project....',
      'Let steal the beggars!',
    ];
    const choose = Math.floor(Math.random() * titles.length);
    return titles[choose];
  };

  const renderViz = function () {
    if (!dsInfo.meta.id) {
      return null;
    }

    return <>
      <Splitter onSplit={(delta: number) => setTableContentHeight(tableContentHeight + delta)}/>

      <h2>2. Visualize</h2>
      <Viz
        ref={vizRef}
        vizHeight={vizHeight}
        dsId={dsInfo.meta.id}
        dsInfo={dsInfo}
        dispatchDsInfo={dispatchDsInfo}
      />
      <Splitter onSplit={(delta: number) => {
        const h = vizHeight || vizRef.current?.element?.getBoundingClientRect().height || 0;
        setVizHeight(h + delta);
      }}/>
    </>;
  };

  return <div className="content">
    <ErrorDialog err={err}/>

    <UserDropdown/>
    <h1>
      {getTitle()}
    </h1>
    <wired-divider/>

    <h2>1. Get the data</h2>
    {/*list existing data source using /ls api*/}
    <DsList onDsSelected={(meta: DsMeta) => dispatchDsInfo({
      type: DsInfoActionType.SELECT_DS,
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

    {renderViz()}
  </div>;
};

SPA = withUserContext(SPA);

export default SPA;

renderPage(<SPA/>);
