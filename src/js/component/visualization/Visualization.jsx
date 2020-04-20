import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import CountDownClock from "./CountDownClock";
import ErrorDialog from "../common/ErrorDialog";
import types from "../../helper/types";
import Loader from "../common/Loader";

class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {
    this.scheduleUpdateStatus();

    const { queryNo, dsId, colSpecs } = this.props;
    if (prevProps.queryNo !== queryNo) {
      // new query should be made
      const actions = this.getActions(colSpecs);

      if (!actions.length) {
        this.setState({ groups: undefined });
        return;
      }

      this.setState({ loading: true, queryNo }, () => {
        fetch(`/ds/${dsId}/visualization?queryNo=${queryNo}&` +
          `actions=${encodeURIComponent(JSON.stringify(actions))}`).then((response) => {
          response.json().then((data) => {
            if (queryNo !== this.state.queryNo) {
              // state has been changed since start of this query,
              // so drop result
              return;
            }

            if (data.success) {
              this.setState({ loading: undefined, groups: data.groups });
            } else {
              ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'));
              this.setState({ loading: undefined });
            }
          }).catch((e) => {
            ErrorDialog.raise('Error parsing JSON response: ' + e.toString());
            this.setState({ loading: undefined });
          })
        }).catch((e) => {
          ErrorDialog.raise('Error fetching data: ' + e.toString());
          this.setState({ loading: undefined });
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
  }

  onClockTimeout = () => {
    this.setState({ clockTimeout: true });
  }

  scheduleUpdateStatus() {
    const { dsId, meta, setMeta } = this.props;

    let { classification, detailization } = meta;
    classification = classification || {};
    detailization = detailization || {};

    if (classification.status === 'finished' &&
      Object.entries(detailization)
        .map(kv => kv[1].status === 'finished')
        .reduce((a, b) => a && b, true)) {
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
            ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'));
          } else {
            const meta = data.list.find((record) => record.id === dsId);
            if (!meta) {
              ErrorDialog.raise(`Server did not return record for id=${dsId}`);
            } else {
              if (setMeta(dsId, meta)) {
                this.scheduleUpdateStatus();
              }
            }
          }
        }).catch((e) => ErrorDialog.raise('Error parsing response: ' + e.toString()))
      }).catch((e) => ErrorDialog.raise('Error fetching data: ' + e.toString()))
    }, 1000);
  }

  /**
   * get an action list which is more-or-less
   * literally mapped to mongo's aggregation pipeline
   * @param types.colSpecs
   * @returns [] of actions
   */
  getActions(colSpecs) {
    let actions = [];

    // 1. find city/country grouping, in order if we should display geo map
    let selectedGrouping;
    let colSpec = colSpecs.find(colSpec =>
      selectedGrouping = colSpec.groupings?.find(grouping => grouping.selected &&
        ['city', 'country'].indexOf(grouping.key) !== -1));
    if (colSpec && selectedGrouping) {
      actions.push({
        col: colSpec.name,
        label: selectedGrouping.key,
      });
    }

    // 2., ... other groupings, aggregations
    // todo

    return actions;
  }

  render() {
    const { meta } = this.props;
    const { loading, groups } = this.state;

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

    if (groups) {
      // todo implement (3)

    }

    // display status of classification
    let { classification, detailization } = meta;
    classification = classification || {};
    detailization = detailization || {};
    if (classification.status !== 'finished') {
      let hint = [
        <p>Please wait while data classification is done.</p>
      ];
      if (classification.status) {
        hint.push(
          <p>Status: {classification.status}</p>
        );
        if (classification.started && classification.estimated) {
          let finished_estimation = moment(classification.started)
            .add(classification.estimated, "millisecond");
          let { clockTimeout } = this.state;
          if (!clockTimeout) {
            hint.push(
              <p><CountDownClock
                to={finished_estimation}
                onClockTimeout={this.onClockTimeout}
              /> left</p>
            );
          } else {
            hint.push(
              <p>Seems classification needs too much time or it's hung,
                please contact&nbsp;
                <a
                  href="mailto:kzerby@gmail.com"
                  target="_blank">developer
                </a>
              </p>
            );
          }
        }
      }

      return hint;
    }

    // display status of columns detailization
    let detailizationByCol = Object.entries(detailization);
    if (!detailizationByCol.length) {
      return <p>Unfortunately, no columns are recognized as known data type.</p>
    }

    let hint = [];
    hint.push(
      <p>Analyzing the columns:</p>
    );
    hint.push(
      <ul>{detailizationByCol.map((kv) => <li key={kv[0]}>{kv[0]}: {kv[1].status}</li>)}</ul>
    );
    if (detailizationByCol.find((kv) => kv[1].status === 'finished')) {
      hint.push(
        <p>Please use dropdowns near the table columns, to visualize data.</p>
      );
    } else {
      hint.push(
        <p>Please wait while columns analysis is done.</p>
      );
    }

    return hint;
  }
}

Visualization.propTypes = {
  dsId: PropTypes.string,
  meta: PropTypes.object,
  setMeta: PropTypes.func,
  colSpecs: types.colSpecs,
  onUpdateColSpec: PropTypes.func,
  queryNo: PropTypes.number
}

export default Visualization;
