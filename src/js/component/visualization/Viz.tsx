import React, { Dispatch, useState } from 'react';
import ErrorDialog from '../common/ErrorDialog';
import Loader from '../common/Loader';
import VizHint from './VizHint';
import VizGraph from './VizGraph';
import { DsInfo, VizData, VizMeta } from '../../model/ds';
import { DsInfoAction } from '../../reducer/dsInfo-reducer';
import { useQueuedRequest } from '../../hook/queued-hook';
import { getVizData } from '../../helper/data-helper';

interface VizProps {
  style?: React.CSSProperties;
  dsId: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

interface VizState {
  vizData?: VizData;
  vizMeta?: VizMeta;
}

const Viz = (props: VizProps) => {
  const [state, setState] = useState<VizState>({});

  const { dsId, dsInfo } = props;
  const pipeline = dsInfo.getPipeline();

  const loading = useQueuedRequest({ dsId, pipeline }, ({ dsId, pipeline }) => {
    if (!pipeline || !pipeline.length) {
      setState({ ...state, vizData: undefined });
      return Promise.resolve();
    }

    return getVizData(dsId, pipeline).then((list) => {
      // put vizMeta to the state to make it consistent with vizData
      setState({ ...state, vizData: list, vizMeta: dsInfo.vizMeta });
    }).catch((e) => {
      ErrorDialog.raise(e.toString());
    });
  }, [dsId, dsInfo.vizMeta]);

  const { style, dispatchDsInfo } = props;
  const { vizData, vizMeta } = state;

  // here can be several situations.
  // (1) a user didn't yet select any visualisation,
  //     in this case we show some hint
  // (2) a user selected visualisation, but data
  //     to display visualisation is not ready.
  //     show loader in this case.
  // (3) data is ready. display corresponding
  //     graph(s).

  return <div>
    <Loader loading={loading}/>
    {
      vizMeta && vizData ?
          <VizGraph
              style={{ height: style?.height }}
              meta={vizMeta}
              data={vizData}
              id="root"
              filters={dsInfo.filters}
              dispatchDsInfo={dispatchDsInfo}
          /> :
          <VizHint
              dsInfo={dsInfo}
              dispatchDsInfo={dispatchDsInfo}
          />
    }
  </div>;
}

export default Viz;
