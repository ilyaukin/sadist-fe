import React, { CSSProperties, Dispatch, HTMLProps, useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import equal from 'deep-equal';
import ErrorDialog from "../common/ErrorDialog";
import ColFilter from "./ColFilter";
import Loader from "../common/Loader";
import { appendElement } from "../../helper/react-helper";
import { ColInfo, DsInfo } from "../../model/ds";
import { DsInfoAction } from '../../reducer/dsInfo-reducer';

interface DsTableProps {
  /**
   height of the table's content
   */
  tableContentHeight: number;
  dsId?: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
  onLoadDs: (ds: any[]) => any;
  ds: any[];
}

interface DsTableState {
  loading: boolean;
}

const DsTable = (props: DsTableProps) => {
  const [state, setState] = useState<DsTableState>({
    loading: false
  });

  const requestedDsId = useRef<string | undefined>();

  const requestedQuery = useRef<any | undefined>();

  const colRefs = useRef<( HTMLTableDataCellElement | null )[] | undefined>();
  if (props.dsId != requestedDsId.current) {
    // we're changing DS so invalidate colRefs,
    // loading sign will be displayed with no cols re-rendering
    colRefs.current = undefined;
  }

  let placeholder: HTMLDivElement | null;

  let table: HTMLDivElement | null;

  let tableContent: HTMLDivElement | null;

  useEffect(() => {
    // console.log(this.colRefs?.map(colRef => colRef?.offsetWidth))
    if (colRefs.current) {
      const { tableContentHeight, dsInfo, ds } = props;
      const { colInfo } = dsInfo;
      appendElement(renderTable(colInfo!, ds, tableContentHeight), placeholder);
    }
  }, [props.tableContentHeight, props.dsInfo, props.ds]);

  useEffect(() => {
    let query: any;

    const { dsId, dsInfo, onLoadDs } = props;
    if (!dsId) {
      return;
    } else if (dsId === requestedDsId.current) {
      query = dsInfo.getFilteringQuery();

      if (equal(query, requestedQuery.current)) {
        return;
      }
    }

    // now we remember that we're doing
    // request with the certain ID and query, and
    // will do next request if and only if some of
    // it changed
    setState({ ...state, loading: true });
    requestedDsId.current = dsId;
    requestedQuery.current = query;

    fetch(!query ?
      `/ds/${dsId}` :
      `/ds/${dsId}/filter?query=${encodeURIComponent(JSON.stringify(query))}`)
      .then((response) => {
        response.json().then((data) => {
          // for the current DS colRefs will be assigned after rendering with received data
          colRefs.current = new Array(dsInfo.colInfo?.length);
          if (data.success) {
            unstable_batchedUpdates(() => {
              onLoadDs(data.list);
              setState({ ...state, loading: false });
            });
          } else {
            handleError('Error: ' + ( data.error || 'Unknown error' ));
          }
        }).catch((err) => {
          handleError(`Error parsing json: ${err.toString()}`)
        })
      }).catch((err) => {
      handleError(`Error fetching ${dsId}: ` + err.toString());
    });
  }, [props.dsId, props.dsInfo, props.onLoadDs]);

  function handleError(err: string) {
    const { onLoadDs } = props;
    onLoadDs([]);
    setState({ ...state, loading: false });
    ErrorDialog.raise(err);
  }

  const onScrollHorizontally = () => {
    tableContent!.style.width = `calc(100% + ${table!.scrollLeft}px)`;
  };

  const refColHeader = (e: HTMLTableHeaderCellElement | null, n: number) => {
    if (colRefs.current) {
      colRefs.current[n] = e;
    }
  };

  const renderColHeader = (colInfo: ColInfo, n: number, isReal: boolean) => {
    const { dispatchDsInfo } = props;

    const thProps: HTMLProps<HTMLTableHeaderCellElement> = {
      key: colInfo.name
    };
    if (isReal) {
      thProps.style = {
        minWidth: colRefs.current![n]!.offsetWidth,
        maxWidth: colRefs.current![n]!.offsetWidth
      };
    } else {
      // fake table
      thProps.ref = e => refColHeader(e, n);
    }

    return <th {...thProps}>
      <div className="col-space">
        {colInfo.name}
        {colInfo.groupings && isReal ?
          <ColFilter
            colInfo={colInfo}
            dispatchDsInfo={dispatchDsInfo}
          /> :
          ''}
      </div>
    </th>;
  };

  const renderFakeColHeader = (colInfo: ColInfo, n: number) => renderColHeader(colInfo, n, false);

  const renderRealColHeader = (colInfo: ColInfo, n: number) => renderColHeader(colInfo, n, true);

  function renderRow(row: any, colnames: string[], isReal: boolean) {
    const cols = [];
    for (let i = 0; i < colnames.length; i++) {
      const v = `${row[colnames[i]]}`;

      const tdProps: HTMLProps<HTMLTableDataCellElement> = {
        key: `row${i}`
      };
      if (isReal) {
        tdProps.style = {
          minWidth: colRefs.current![i]!.offsetWidth,
          maxWidth: colRefs.current![i]!.offsetWidth
        };
      }

      cols.push(<td {...tdProps}>{v}</td>);
    }

    return cols;
  }

  const renderFakeRow = (row: any, colnames: string[]) => renderRow(row, colnames, false);

  const renderRealRow = (row: any, colnames: string[]) => renderRow(row, colnames, true);

  function renderFakeTable(colInfos: ColInfo[], ds: any[]) {
    const colnames = colInfos.map(colSpec => colSpec.name);

    return <div key="fake" className="fake-table">
      <table cellPadding="2">
        <thead>
        <tr>
          {colInfos.map(renderFakeColHeader)}
        </tr>
        </thead>
        <tbody>
        {ds.slice(0, 10).map((row) => <tr key={row.id}>
          {renderFakeRow(row, colnames)}
        </tr>)}
        </tbody>
      </table>
    </div>
  }

  function renderTable(colInfos: ColInfo[], ds: any[], height = 200) {
    const colnames = colInfos.map(colSpec => colSpec.name);
    const headHeight = colRefs.current![0]!.offsetHeight;
    const outerDivStyle: CSSProperties = {
      position: 'relative',
      overflowX: 'auto',
      padding: `${headHeight}px 0 0 0`,
      margin: '10px 0 10px 0',
      background: '#eee',
      // border: '1px red solid'
    };
    const innerDivStyle: CSSProperties = {
      overflowY: 'auto',
      overflowX: 'hidden',
      height: `${height}px`,
      // border: '1px blue solid'
    };
    const tableStyle: CSSProperties = {
      tableLayout: 'fixed',
    };
    const theadTrStyle: CSSProperties = {
      position: 'absolute',
      top: 0,
      height: `${headHeight}px`,
      left: 0,
      border: 0,  // dunno why, but this fixes 1px shift
      background: '#ccc'
    };

    return <div
      style={outerDivStyle}
      ref={e => table = e}
      onScroll={onScrollHorizontally}
    >
      <div
        style={innerDivStyle}
        ref={e => tableContent = e}
      >
        <table style={tableStyle}>
          <thead>
          <tr style={theadTrStyle}>
            {colInfos.map(renderRealColHeader)}
          </tr>
          </thead>
          <tbody>
          {ds.map((row) => <tr key={row.id}>
            {renderRealRow(row, colnames)}
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }

  let { dsId, dsInfo, ds } = props;
  let { colInfo } = dsInfo;

  if (!dsId || !colInfo) {
    return <br/>;
  }

  return <>
    {[
      <Loader loading={state.loading}/>,

      // first we render table inside div of height=0,
      // with default table-row positioning, in order
      // to determine natural col widths with aid of
      // browser's rendering engine engine
      renderFakeTable(colInfo, ds),

      // after that values are defined, render proper
      // table using ReactDom.render in componentDidUpdate
      <div key="real" ref={(e) => placeholder = e}/>
    ]}
  </>
}

DsTable.defaultProps = {
  tableContentHeight: 200
};

export default DsTable;