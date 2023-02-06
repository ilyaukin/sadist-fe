import React, { Dispatch, useEffect, useRef, useState } from 'react';
import equal from 'deep-equal';
import ErrorDialog from '../common/ErrorDialog';
import Loader from '../common/Loader';
import GeoMap from './GeoMap';
import { DsInfo, DsMeta, FilteringValue } from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';

interface VisualizationProps {
  dsId: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
}

interface VisualizationState {
  loading?: boolean;
  result?: any;
}

const Visualization = (props: VisualizationProps) => {
  const [state, setState] = useState<VisualizationState>({});

  const timeoutHandle = useRef<NodeJS.Timeout | undefined>();

  const requestedQueryNo = useRef(0);

  const requestedPipeline = useRef<any | undefined>();

  useEffect(() => {
    if (timeoutHandle.current) {
      clearTimeout(timeoutHandle.current);
    }

    timeoutHandle.current = scheduleUpdateStatus.call(this);

    return () => clearTimeout(timeoutHandle.current);
  }, [props.dsId, props.dsInfo, props.dispatchDsInfo]);

  useEffect(() => {
    const { dsId, dsInfo } = props;
    const pipeline = dsInfo.getPipeline();

    if (!dsInfo.shouldUpdateVisualization) {
      // the event which changed dsInfo is not related to visualization
      // should not request new visualization data
      return;
    }

    if (equal(pipeline, requestedPipeline.current)) {
      return;
    }

    if (!pipeline.length) {
      setState({ ...state, result: undefined });
      return;
    }

    //todo consider useTransition instead of hack with queryNo
    const queryNo = ++requestedQueryNo.current;
    requestedPipeline.current = pipeline;
    setState({ ...state, loading: true });
    fetch(`/ds/${dsId}/visualize?queryNo=${queryNo}&` +
      `pipeline=${encodeURIComponent(JSON.stringify(pipeline))}`).then((response) => {
      response.json().then((data) => {
        if (queryNo !== requestedQueryNo.current) {
          // state has been changed since start of this query,
          // so drop result
          return;
        }

        if (data.success) {
          setState({ ...state, loading: undefined, result: data.list });
        } else {
          handleError('Error: ' + ( data.error || 'Unknown error' ));
        }
      }).catch((e) => {
        handleError('Error parsing JSON response: ' + e.toString());
      });
    }).catch((e) => {
      handleError('Error fetching data: ' + e.toString());
    });
  }, [props.dsId, props.dsInfo]);

  function scheduleUpdateStatus(): NodeJS.Timeout | undefined {
    const { dsId, dsInfo, dispatchDsInfo } = props;

    if (dsInfo.isFinal()) {
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
    setState({ ...state, loading: undefined });
  }

  const { dsInfo, dispatchDsInfo } = props;
  const { loading, result } = state;
  const pipeline = requestedPipeline.current;

  // here can be several situations.
  // (1) a user didn't yet select any filter,
  //     in this case we show some hint
  // (2) a user selected filters, but data
  //     to display visualisation is not ready.
  //     show loader in this case.
  // (3) data is ready. display corresponding
  //     graph(s).

  if (loading) {
    return <Loader loading={true}/>;
  }

  if (pipeline && pipeline.length && result) {
    // 1. if pipeline 1st item is city/country, display geo map
    if (['city', 'country'].indexOf(pipeline[0].key) !== -1) {
      return <GeoMap
        result={result}
        filteringValues={dsInfo.getFilteringValues(pipeline[0].col, `${pipeline[0].key}.id`)}
        onUpdateFilteringValues={(values: FilteringValue[]) => dispatchDsInfo({
          type: DsInfoActionType.FILTER,
          col: pipeline[0].col,
          key: `${pipeline[0].key}.id`,
          values
        })}
        onDropFiltering={() => dispatchDsInfo({
          type: DsInfoActionType.DROP_FILTER,
          col: pipeline[0].col
        })}
      />;
    }

    // 2. other groupings, ...
    // todo
  }

  return <>
    {dsInfo.getHint()}
  </>;
}

export default Visualization;