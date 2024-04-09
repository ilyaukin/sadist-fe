import React, { Dispatch, useState } from 'react';
import ErrorDialog from '../common/ErrorDialog';
import Loader from '../common/Loader';
import VizHint from './VizHint';
import VizGraph from './VizGraph';
import { DsInfo, VizData, VizMeta } from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { useQueuedRequest } from '../../hook/queued-hook';
import { getMeta } from '../../helper/data-helper';

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
  const [updateMetaCounter, setUpdateMetaCounter] = useState(0);

  const { dsId, dsInfo } = props;
  const pipeline = dsInfo.getPipeline();

  const loading = useQueuedRequest({ dsId, pipeline }, ({ dsId, pipeline }) => {
    if (!pipeline || !pipeline.length) {
      setState({ ...state, vizData: undefined });
      return Promise.resolve();
    }

    return fetch(`/ds/${dsId}/visualize?` +
        `pipeline=${encodeURIComponent(JSON.stringify(pipeline))}`).then((response) => {
      response.json().then((data) => {
        if (data.success) {
          // put vizMeta to the state to make it consistent with vizData
          setState({ ...state, vizData: data.list, vizMeta: dsInfo.vizMeta });
        } else {
          ErrorDialog.raise('Error: ' + ( data.error || 'Unknown error' ));
        }
      }).catch((e) => {
        ErrorDialog.raise('Error parsing JSON response: ' + e.toString());
      });
    }).catch((e) => {
      ErrorDialog.raise('Error fetching data: ' + e.toString());
    });
  }, [dsId, dsInfo.vizMeta]);

  const metaLoading = useQueuedRequest({ dsId }, ({ dsId }) =>
      getMeta(dsId)
          .then((meta) => {
            dispatchDsInfo({
              type: DsInfoActionType.UPDATE_META_SUCCESS,
              meta,
            });
            setTimeout(() => {
              if (!dsInfo.isMetaFinal()) {
                setUpdateMetaCounter(counter => counter + 1);
              }
            }, 1000);
          })
          .catch((err) => {
            dispatchDsInfo({
              type: DsInfoActionType.UPDATE_META_ERROR,
              err: err.toString(),
            })
          }), [dsId, updateMetaCounter], true);

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
    <Loader loading={loading || metaLoading}/>
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
