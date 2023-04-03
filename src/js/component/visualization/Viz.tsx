import React, {
  Dispatch,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import ErrorDialog from '../common/ErrorDialog';
import Loader from '../common/Loader';
import VizHint from './VizHint';
import VizGraph from './VizGraph';
import { DsInfo, DsMeta, VizData, VizMeta } from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { useQueuedRequest } from '../../hook/queued-hook';

interface VizProps {
  vizHeight?: number;
  dsId: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

interface VizState {
  vizData?: VizData;
  vizMeta?: VizMeta;
}

export type VizElement = { element: HTMLDivElement | null; } & VizState;

const Viz = (props: VizProps, ref: React.ForwardedRef<VizElement>) => {
  const [state, setState] = useState<VizState>({});

  const elementRef = useRef<HTMLDivElement | null>(null);

  const timeoutHandle = useRef<NodeJS.Timeout | undefined>();

  useImperativeHandle(ref, () => ({ element: elementRef.current, ...state }));

  useEffect(() => {
    if (timeoutHandle.current) {
      clearTimeout(timeoutHandle.current);
    }

    timeoutHandle.current = scheduleUpdateStatus.call(this);

    return () => clearTimeout(timeoutHandle.current);
  }, [props.dsId, props.dsInfo, props.dispatchDsInfo]);

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
          handleError('Error: ' + ( data.error || 'Unknown error' ));
        }
      }).catch((e) => {
        handleError('Error parsing JSON response: ' + e.toString());
      });
    }).catch((e) => {
      handleError('Error fetching data: ' + e.toString());
    });
  }, [props.dsId, props.dsInfo.vizMeta]);

  function scheduleUpdateStatus(): NodeJS.Timeout | undefined {
    const { dsId, dsInfo, dispatchDsInfo } = props;

    if (dsInfo.isMetaFinal()) {
      // everything finished, no need to update
      return;
    }

    return setTimeout(() => {
      fetch(`/ls?id=${dsId}`).then((response) => {
        response.json().then((data) => {
          if (!data.success) {
            handleUpdateStatusError(data.error || 'Unknown error');
          } else {
            const meta = data.list.find((record: DsMeta) => record.id === dsId);
            if (!meta) {
              handleUpdateStatusError(`Server did not return record for id=${dsId}`);
            } else {
              if (props.dsId === meta.id) {
                dispatchDsInfo({ type: DsInfoActionType.UPDATE_STATUS_SUCCESS, meta });
                scheduleUpdateStatus();
              }
            }
          }
        }).catch((e) => handleUpdateStatusError('Error parsing response: ' + e.toString()));
      }).catch((e) => handleUpdateStatusError('Error fetching data: ' + e.toString()));
    }, 1000);
  }

  function handleUpdateStatusError(err: string) {
    props.dispatchDsInfo({ type: DsInfoActionType.UPDATE_STATUS_ERROR, err });
  }

  function handleError(err: string) {
    ErrorDialog.raise(err);
  }

  const { vizHeight, dispatchDsInfo } = props;
  const { vizData, vizMeta } = state;

  // here can be several situations.
  // (1) a user didn't yet select any visualisation,
  //     in this case we show some hint
  // (2) a user selected visualisation, but data
  //     to display visualisation is not ready.
  //     show loader in this case.
  // (3) data is ready. display corresponding
  //     graph(s).

  return <div ref={elementRef} className="block">
    <Loader loading={loading}/>
    {
      vizMeta && vizData ?
          <VizGraph
              style={{ height: typeof vizHeight === 'number' ? `${vizHeight}px` : 'auto' }}
              meta={vizMeta}
              data={vizData}
              id="root"
              filterProposals={dsInfo.filterProposals}
              dispatchDsInfo={dispatchDsInfo}
          /> :
          <VizHint
              dsInfo={dsInfo}
              dispatchDsInfo={dispatchDsInfo}
          />
    }
  </div>;
}

export default forwardRef(Viz);
