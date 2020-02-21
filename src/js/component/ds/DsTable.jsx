import React, { Component } from 'react';
import PropTypes from 'proptypes';
import ErrorDialog from "../common/ErrorDialog";

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

  renderRow(ds_row, colnames) {
    const cols = [];
    for (let i = 0; i < colnames.length; i++) {
      const v = `${ds_row[colnames[i]]}`;

      cols.push(<td key={`row${i}`}>{v}</td>);
    }

    return cols;
  }

  render() {
    const { cols, ds } = this.props;

    if (ds && !!ds.length) {
      const colnames = cols ||
        Object.keys(ds[0]).filter(key => key !== 'id');

      return <table cellPadding="2">
        <thead>
        <tr>
          {colnames.map(colname => <th key={colname}>{colname}</th>)}
        </tr>
        </thead>
        <tbody>
        {ds.slice(0, 10).map((ds_row) => <tr key={ds_row.id}>
          {this.renderRow(ds_row, colnames)}
        </tr>)}
        {ds.length > 10 ? <tr><td colSpan={colnames.length}>...</td></tr> : ''}
        </tbody>
      </table>
    }

    return <br/>;
  }
}

DsTable.propTypes = {
  dsId: PropTypes.string,
  cols: PropTypes.arrayOf(PropTypes.string),
  onLoadDs: PropTypes.func,
  ds: PropTypes.arrayOf(PropTypes.object)
};

export default DsTable;
