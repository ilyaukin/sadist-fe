import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../css/index.scss';
import './common/CustomElement';
import ErrorDialog from './common/ErrorDialog';
import UserDropdown from './user/UserDropdown';
import DsList from './ds/DsList';
import DsTable from './ds/DsTable';
import Viz, { VizElement } from './visualization/Viz';
import Splitter from './common/Splitter';
import Footer from './common/Footer';
import {
  defaultDsInfo,
  DsInfoActionType,
  reduceDsInfo
} from '../reducer/dsInfo-reducer';
import { CellType, DsInfo, DsMeta } from '../model/ds';

const SPAContent = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [err, setErr] = React.useState<string>();
  const [ds, setDs] = React.useState<any[]>([]);
  const [dsInfo, dispatchDsInfo] = React.useReducer(reduceDsInfo, defaultDsInfo);
  const [tableContentHeight, setTableContentHeight] = React.useState(
      Math.min(300, Math.max(100, Math.floor(window.innerHeight / 3))));
  const [vizHeight, setVizHeight] = React.useState<number | undefined>();

  function propagateDsInfoToURL(dsInfo: DsInfo) {
    if (dsInfo.meta.id) {
      const params: { [p: string]: string; } = { id: dsInfo.meta.id };
      const anchor = searchParams.get('anchor');
      if (anchor && dsInfo.meta.id === searchParams.get('id')) {
        params.anchor = anchor;
      }
      setSearchParams(params);
    }
  }

  function propagateAnchorToURL(anchor: CellType) {
    const params: { [p: string]: string; } = {};
    const dsId = searchParams.get('id');
    if (dsId) {
      params.id = dsId;
    }
    if (anchor) {
      params.anchor = JSON.stringify(anchor);
    }
    setSearchParams(params);
  }

  useEffect(() => {
    propagateDsInfoToURL(dsInfo);
  }, [dsInfo.meta.id]);

  ErrorDialog.raise = setErr;
  ErrorDialog.close = () => setErr(undefined);

  const vizRef = useRef<VizElement | null>(null);

  const titles = [
    'My handicapped pet project....',
    'Let steal the beggars!',
  ];
  const choose = Math.floor(Math.random() * titles.length);
  const title = titles[choose];

  return React.useMemo(() => <div className="content">
    <ErrorDialog err={err}/>

    <UserDropdown/>
    <h1>
      {title}
    </h1>
    <wired-divider/>

    <h2>1. Get the data</h2>
    {/*list existing data source using /ls api*/}
    <DsList
        dsId={dsInfo.meta.id}
        onLoadList={(list: DsMeta[]) => {
          const dsId = searchParams.get('id');
          if (dsId) {
            const meta = list.find(item => item.id === dsId);
            if (meta) {
              const anchor = searchParams.get('anchor');
              dispatchDsInfo({
                type: DsInfoActionType.SELECT_DS,
                meta,
                anchor: anchor && JSON.parse(anchor),
              });
            }
          }
        }}
        onDsSelected={(meta: DsMeta) => {
          dispatchDsInfo({
            type: DsInfoActionType.SELECT_DS,
            meta
          });
        }}
    />
    {/*show top from selected ds*/}
    <DsTable
        tableContentHeight={tableContentHeight}
        dsId={dsInfo.meta.id}
        dsInfo={dsInfo}
        dispatchDsInfo={dispatchDsInfo}
        onLoadDs={setDs}
        ds={ds}
        onSelectCell={propagateAnchorToURL}
    />

    {dsInfo.meta.id && <>
      <Splitter
          onSplit={(delta: number) => setTableContentHeight(tableContentHeight + delta)}/>

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
    </>}
    <Footer/>
  </div>, [err, ds, dsInfo, tableContentHeight, vizHeight]);
};

export default SPAContent;
