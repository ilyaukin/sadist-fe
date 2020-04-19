import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorDialog from "../common/ErrorDialog";
import types from "../../helper/types";
import ColFilter from "./ColFilter";

class DsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dsId, onLoadDs } = this.props;

    if (!dsId || dsId === prevProps.dsId) {
      return;
    }

    fetch(`/ds/${dsId}`)
      .then((response) => {
        response.json().then((data) => {
          if (data.success) {
            onLoadDs(data.list);
          } else {
            this.handleError('Error: ' + (data.error || 'Unknown error'));
          }
        }).catch((err) => {
          this.handleError(`Error parsing json: ${err.toString()}`)
        })
      }).catch((err) => {
      this.handleError(`Error fetching ${dsId}: ` + err.toString());
    })
  }

  handleError(err) {
    const { onLoadDs } = this.props;
    onLoadDs([]);
    ErrorDialog.raise(err);
  }

  renderColHeader = colSpec => {
    const { onUpdateColSpec } = this.props;

    return <th key={colSpec.name}>
      <div className="col-space">
        {colSpec.name}
        {colSpec.groupings ?
          <ColFilter
            colSpec={colSpec}
            onUpdateColSpec={onUpdateColSpec}
          /> :
          ''}
      </div>
    </th>;
  };

  renderRow(ds_row, colnames) {
    const cols = [];
    for (let i = 0; i < colnames.length; i++) {
      const v = `${ds_row[colnames[i]]}`;

      cols.push(<td key={`row${i}`}>{v}</td>);
    }

    return cols;
  }

  render() {
    let { colSpecs, ds } = this.props;

    if (ds && !!ds.length) {
      const colnames = colSpecs.map(colSpec => colSpec.name) ||
        Object.keys(ds[0]).filter(key => key !== 'id');

      return <table cellPadding="2">
        <thead>
        <tr>
          {colSpecs.map(this.renderColHeader)}
        </tr>
        </thead>
        <tbody>
        {ds.slice(0, 10).map((ds_row) => <tr key={ds_row.id}>
          {this.renderRow(ds_row, colnames)}
        </tr>)}
        {ds.length > 10 ? <tr><td colSpan={colnames.length}>...</td></tr> : []}
        </tbody>
      </table>
    }

    return <br/>;
  }
}

DsTable.propTypes = {
  dsId: PropTypes.string,
  colSpecs: types.colSpecs,
  onUpdateColSpec: PropTypes.func,
  onLoadDs: PropTypes.func,
  ds: PropTypes.arrayOf(PropTypes.object)
};

export default DsTable;
