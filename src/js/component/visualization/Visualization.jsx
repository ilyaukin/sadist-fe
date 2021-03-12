import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import ErrorDialog from '../common/ErrorDialog';
import types from '../../helper/types';
import Loader from '../common/Loader';
import { GeoMap } from './GeoMap';
import { actionType } from '../../reducer/dsInfo-reducer';

class Visualization extends Component {
  queryNo = 0;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState) {
    const { dsInfo } = this.props;
    if (prevProps.dsInfo != dsInfo && dsInfo.shouldUpdateVisualization) {
      this.refresh();
    }

    this.scheduleUpdateStatus();
  }

  componentWillUnmount() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }

  onClockTimeout = () => {
    this.setState({ clockTimeout: true });
  };

  scheduleUpdateStatus() {
    const { dsId, dsInfo, dispatchDsInfo } = this.props;

    if (dsInfo.isFinal()) {
      // everything finished, no need to update
      return;
    }

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(() => {
      fetch(`/ls?id=${dsId}`).then((response) => {
        response.json().then((data) => {
          if (!data.success) {
            this.handleUpdateStatusError(data.error || 'Unknown error');
          } else {
            const meta = data.list.find((record) => record.id === dsId);
            if (!meta) {
              this.handleUpdateStatusError(`Server did not return record for id=${dsId}`);
            } else {
              if (this.props.dsId === meta.id) {
                dispatchDsInfo({ type: actionType.UPDATE_STATUS_SUCCESS, meta });
                this.scheduleUpdateStatus();
              }
            }
          }
        }).catch((e) => this.handleUpdateStatusError('Error parsing response: ' + e.toString()));
      }).catch((e) => this.handleUpdateStatusError('Error fetching data: ' + e.toString()));
    }, 1000);
  }

  handleUpdateStatusError(err) {
    this.props.dispatchDsInfo({ type: actionType.UPDATE_STATUS_ERROR, err });
  }

  refresh() {
    const { dsId, dsInfo } = this.props;
    const pipeline = dsInfo.getPipeline();

    if (equal(pipeline, this.state.pipeline)) {
      return;
    }

    if (!pipeline.length) {
      this.setState({ result: undefined });
      return;
    }

    let queryNo = ++this.queryNo;
    this.setState({ loading: true, queryNo, pipeline }, () => {

      fetch(`/ds/${dsId}/visualize?queryNo=${queryNo}&` +
        `pipeline=${encodeURIComponent(JSON.stringify(pipeline))}`).then((response) => {
        response.json().then((data) => {
          if (queryNo !== this.state.queryNo) {
            // state has been changed since start of this query,
            // so drop result
            return;
          }

          if (data.success) {
            this.setState({ loading: undefined, result: data.list });
          } else {
            this.handleError('Error: ' + (data.error || 'Unknown error'));
          }
        }).catch((e) => {
          this.handleError('Error parsing JSON response: ' + e.toString());
        });
      }).catch((e) => {
        this.handleError('Error fetching data: ' + e.toString());
      });
    });
  }

  handleError(err) {
    ErrorDialog.raise(err);
    this.setState({ loading: undefined });
  }

  render() {
    const { dsInfo, dispatchDsInfo } = this.props;
    const { loading, pipeline, result, clockTimeout } = this.state;

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
          onUpdateFilteringValues={(values) => dispatchDsInfo({
            type: actionType.FILTER,
            col: pipeline[0].col,
            key: `${pipeline[0].key}.name`,
            values
          })}
          onDropFiltering={() => dispatchDsInfo({
            type: actionType.DROP_FILTER,
            col: pipeline[0].col
          })}
        />;
      }

      // 2. other groupings, ...
      // todo
    }

    return dsInfo.getHint({ clockTimeout, onClockTimeout: this.onClockTimeout });
  }
}

Visualization.propTypes = {
  dsId: PropTypes.string,
  dsInfo: types.dsInfo,
  dispatchDsInfo: PropTypes.func
};

export default Visualization;
