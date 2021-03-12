import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import ErrorDialog from "../common/ErrorDialog";
import types from "../../helper/types";
import ColFilter from "./ColFilter";
import Loader from "../common/Loader";
import { appendElement } from "../../helper/react-helper";

class DsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps == this.props && !nextState.loading) {
      // we've just finished loading, no need to re-render
      // cause it will be done after onLoadDs
      return false;
    }
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.dsId != nextProps.dsId) {
      this.colRefs = undefined;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.colRefs?.map(colRef => colRef?.offsetWidth))
    if (this.colRefs) {
      const { tableContentHeight, dsInfo, ds } = this.props;
      const { colSpecs } = dsInfo;
      appendElement(this.renderTable(colSpecs, ds, tableContentHeight), this.placeholder);
    }

    let query;

    const { dsId, onLoadDs } = this.props;
    if (!dsId) {
      return;
    } else if (dsId === prevProps.dsId) {
      const { dsInfo } = this.props;
      query = dsInfo.getFilteringQuery();

      if (equal(query, this.state.query)) {
        return;
      }
    }

    this.setState({ query, loading: true },
      () => fetch(!query ?
        `/ds/${dsId}` :
        `/ds/${dsId}/filter?query=${encodeURIComponent(JSON.stringify(query))}`)
        .then((response) => {
          response.json().then((data) => {
            this.colRefs = new Array(this.props.dsInfo.colSpecs.length);
            if (data.success) {
              this.setState({ loading: false });
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
    );
  }

  handleError(err) {
    this.setState({ loading: false });
    const { onLoadDs } = this.props;
    onLoadDs([]);
    ErrorDialog.raise(err);
  }

  onScrollHorizontally = () => {
    this.tableContent.style.width = `calc(100% + ${this.table.scrollLeft}px)`;
  };

  refColHeader = (e, n) => {
    if (this.colRefs) {
      this.colRefs[n] = e;
    }
  };

  renderColHeader = (colSpec, n, isReal) => {
    const { dispatchDsInfo } = this.props;

    const thProps = {
      key: colSpec.name
    };
    if (isReal) {
      thProps.style = {
        minWidth: this.colRefs[n].offsetWidth,
        maxWidth: this.colRefs[n].offsetWidth
      };
    } else {
      // fake table
      thProps.ref = e => this.refColHeader(e, n);
    }

    return <th {...thProps}>
      <div className="col-space">
        {colSpec.name}
        {colSpec.groupings && isReal ?
          <ColFilter
            colSpec={colSpec}
            dispatchDsInfo={dispatchDsInfo}
          /> :
          ''}
      </div>
    </th>;
  };

  renderFakeColHeader = (colSpec, n) => this.renderColHeader(colSpec, n, false);

  renderRealColHeader = (colSpec, n) => this.renderColHeader(colSpec, n, true);

  renderRow(row, colnames, isReal) {
    const cols = [];
    for (let i = 0; i < colnames.length; i++) {
      const v = `${row[colnames[i]]}`;

      const tdProps = {
        key: `row${i}`
      };
      if (isReal) {
        tdProps.style = {
          minWidth: this.colRefs[i].offsetWidth,
          maxWidth: this.colRefs[i].offsetWidth
        };
      }

      cols.push(<td {...tdProps}>{v}</td>);
    }

    return cols;
  }

  renderFakeRow = (row, colnames) => this.renderRow(row, colnames, false);

  renderRealRow = (row, colnames) => this.renderRow(row, colnames, true);

  renderFakeTable(colSpecs, ds) {
    const colnames = colSpecs.map(colSpec => colSpec.name);

    return <div key="fake" className="fake-table">
      <table cellPadding="2">
        <thead>
        <tr>
          {colSpecs.map(this.renderFakeColHeader)}
        </tr>
        </thead>
        <tbody>
        {ds.slice(0, 10).map((row) => <tr key={row.id}>
          {this.renderFakeRow(row, colnames)}
        </tr>)}
        </tbody>
      </table>
    </div>
  }

  renderTable(colSpecs, ds, height = '200') {
    const colnames = colSpecs.map(colSpec => colSpec.name);
    const headHeight = this.colRefs[0].offsetHeight;
    const outerDivStyle = {
      position: 'relative',
      overflowX: 'auto',
      padding: `${headHeight}px 0 0 0`,
      margin: '10px 0 10px 0',
      background: '#eee',
      // border: '1px red solid'
    };
    const innerDivStyle = {
      overflowY: 'auto',
      overflowX: 'hidden',
      height: `${height}px`,
      // border: '1px blue solid'
    };
    const tableStyle = {
      tableLayout: 'fixed',
    };
    const theadTrStyle = {
      position: 'absolute',
      top: 0,
      height: `${headHeight}px`,
      left: 0,
      border: 0,  // dunno why, but this fixes 1px shift
      background: '#ccc'
    };

    return <div
      style={outerDivStyle}
      ref={table => this.table = table}
      onScroll={this.onScrollHorizontally}
    >
      <div
        style={innerDivStyle}
        ref={tableContent => this.tableContent = tableContent}
      >
        <table style={tableStyle}>
          <thead>
          <tr style={theadTrStyle}>
            {colSpecs.map(this.renderRealColHeader)}
          </tr>
          </thead>
          <tbody>
          {ds.map((row) => <tr key={row.id}>
            {this.renderRealRow(row, colnames)}
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }

  render() {
    let { dsId, dsInfo, ds } = this.props;
    let { colSpecs } = dsInfo;

    if (!dsId || !colSpecs) {
      return <br/>;
    }

    return [
      <Loader loading={this.state.loading}/>,

      // first we render table inside div of height=0,
      // with default table-row positioning, in order
      // to determine natural col widths with aid of
      // browser's rendering engine engine
      this.renderFakeTable(colSpecs, ds),

      // after that values are defined, render proper
      // table using ReactDom.render in componentDidUpdate
      <div key='real' ref={(placeholder) => this.placeholder = placeholder}/>
    ];
  }
}

DsTable.propTypes = {
  // height of the table's content
  tableContentHeight: PropTypes.number,

  dsId: PropTypes.string,
  dsInfo: types.dsInfo,
  dispatchDsInfo: PropTypes.func,
  onLoadDs: PropTypes.func,
  ds: PropTypes.arrayOf(PropTypes.object)
};

DsTable.defaultProps = {
  tableContentHeight: 200
};

export default DsTable;
