import React, {
  CSSProperties,
  Dispatch,
  HTMLProps,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react';
import ErrorDialog from "../common/ErrorDialog";
import ColDropdown from "./ColDropdown";
import Loader from "../common/Loader";
import { CellType, DsInfo } from "../../model/ds";
import { DsInfoAction } from '../../reducer/dsInfo-reducer';
import { useQueuedRequest } from '../../hook/queued-hook';
import { scrollToVisible } from '../../helper/scroll-helper';

interface DsTableProps {
  style?: React.CSSProperties;
  dsId?: string;
  dsInfo: DsInfo;
  dispatchDsInfo: Dispatch<DsInfoAction>;
  onLoadDs: (ds: any[]) => any;
  ds: any[];
  onSelectCell: (cell: CellType) => any;
}

interface DsTableState {
  loading: boolean;
  table?: JSX.Element;
}

/**
 * show top from selected ds
 * @param props
 * @constructor
 */
const DsTable = (props: DsTableProps) => {
  const [state, setState] = useState<DsTableState>({
    loading: false
  });

  const colRefs = useRef<( HTMLTableDataCellElement | null )[] | undefined>();

  const rootElementRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const tableContentRef = useRef<HTMLDivElement | null>(null);

  const selectedCellRef = useRef<Element | null>(null);

  const { style, dsId, dsInfo, onLoadDs, ds, onSelectCell } = props;

  useEffect(() => {
    // console.log(colRefs.current?.map(colRef => colRef?.offsetWidth))
    if (colRefs.current) {
      setState({ ...state, table: renderTable(), loading: false });
    }
  }, [dsInfo, ds, style?.height]);

  useEffect(() => {
    if (state.table && dsInfo.anchor) {
      selectCell(dsInfo.anchor);
    }
  }, [state.table, dsInfo.anchor]);

  const query = dsInfo.getFilterQuery();
  const colnames = dsInfo.meta.cols;
  const coltypes = colnames?.map(col => col.split(':')[1]);

  useQueuedRequest({ dsId, cols: colnames, query }, ({ dsId, cols, query }) => {
    if (!dsId || !cols) {
      return Promise.resolve();
    }

    // we're changing DS so invalidate colRefs,
    // loading sign will be displayed with no cols re-rendering
    colRefs.current = undefined;
    setState({ ...state, loading: true });

    return fetch(!query ?
        `/ds/${dsId}` :
        `/ds/${dsId}/filter?query=${encodeURIComponent(JSON.stringify(query))}`)
        .then((response) => response.json())
        .then((data) => {
          // for the current DS colRefs will be assigned after rendering with received data
          colRefs.current = new Array(cols.length);
          if (data.success) {
            onLoadDs(data.list);
          } else {
            handleError('Error: ' + ( data.error || 'Unknown error' ));
          }
        }).catch((err) => {
          handleError(`Error fetching ${dsId}: ` + err.toString());
        });
  }, [props.dsInfo]);

  function handleError(err: string) {
    onLoadDs([]);
    ErrorDialog.raise(err);
  }

  function selectCell(cell: CellType) {
    // find element
    const element = tableContentRef.current
        ?.querySelector(typeof cell[1] == 'number' ?
            `tbody tr[data-id="${cell[0]}"] td:nth-child(${cell[1] + 1})` :
            `tbody tr[data-id="${cell[0]}"] td[data-id="${cell[1]}"]`);

    if (selectedCellRef.current === element) {
      return;
    }

    if (element) {
      // focus element
      ( element as HTMLElement ).focus();

      // scroll for visibility
      scrollToVisible(element, tableContentRef.current);

      // propagate state
      onSelectCell(cell);
    }

    selectedCellRef.current = element || null;
  }

  const onScrollHorizontally = () => {
    tableContentRef.current!.style.width = `calc(100% + ${tableRef.current!.scrollLeft}px)`;
  };

  const refColHeader = (e: HTMLTableHeaderCellElement | null, n: number) => {
    if (colRefs.current) {
      colRefs.current[n] = e;
    }
  };

  const renderColHeader = (col: string, n: number, isReal: boolean) => {
    const { dsInfo, dispatchDsInfo } = props;

    const thProps: HTMLProps<HTMLTableHeaderCellElement> = {
      key: col
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
        {col}
        {( dsInfo.vizMetaProposedByCol?.[col] || dsInfo.filtersByCol?.[col] ) && isReal ?
            <ColDropdown
                col={col}
                dsInfo={dsInfo}
                dispatchDsInfo={dispatchDsInfo}
            /> :
            ''}
      </div>
    </th>;
  };

  const renderFakeColHeader = (col: string, n: number) => renderColHeader(col, n, false);

  const renderRealColHeader = (col: string, n: number) => renderColHeader(col, n, true);

  function renderRow(row: any, _n: number, isReal: boolean) {
    const cols = [];
    for (let i = 0; i < colnames!.length; i++) {
      let v = row[colnames![i]];
      // allow type-specific display
      let V: ReactNode;
      switch (coltypes![i]) {
        case "html":
          V = <div dangerouslySetInnerHTML={{ __html: v }}/>;
          break;
        case "#":
          V = isNaN(parseInt(v)) ? `${v}` :
              <a className="bare" onClick={(e) => {
                e.stopPropagation();
                selectCell([v, i]);
              }}>{`#${v}`}</a>;
          break;
        default:
          V = `${v}`;
      }

      const tdProps: HTMLProps<HTMLTableDataCellElement> = {
        key: `row${i}`
      };
      if (isReal) {
        tdProps.style = {
          minWidth: colRefs.current![i]!.offsetWidth,
          maxWidth: colRefs.current![i]!.offsetWidth
        };
        tdProps.onClick = () => {
          selectCell([row.id, colnames![i]]);
        };
        tdProps.tabIndex = 0;
      }

      cols.push(<td data-id={colnames![i]} {...tdProps}>{V}</td>);
    }

    return <tr key={row.id} data-id={row.id}>{cols}</tr>;
  }

  const renderFakeRow = (row: any, n: number) => {
    return renderRow(row, n, false);
  };

  const renderRealRow = (row: any, n: number) => {
    return renderRow(row, n, true);
  };

  function renderFakeTable() {
    return <div key="fake" className="fake-table">
      <table cellPadding="2">
        <thead>
        <tr>
          {colnames!.map(renderFakeColHeader)}
        </tr>
        </thead>
        <tbody>
        {ds.slice(0, 10).map((row, i) => renderFakeRow(row, i))}
        </tbody>
      </table>
    </div>
  }

  function renderTable() {
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
      height: style?.height,
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
        key="real"
        style={outerDivStyle}
        ref={tableRef}
        onScroll={onScrollHorizontally}
    >
      <div
          style={innerDivStyle}
          ref={tableContentRef}
      >
        <table style={tableStyle}>
          <thead>
          <tr style={theadTrStyle}>
            {colnames!.map(renderRealColHeader)}
          </tr>
          </thead>
          <tbody>
          {ds.map((row, i) => renderRealRow(row, i))}
          </tbody>
        </table>
      </div>
    </div>
  }

  if (!dsId || !colnames) {
    return <br/>;
  }

  return <div ref={rootElementRef} className="block">
    {[
      <Loader loading={state.loading}/>,

      // first we render table inside div of height=0,
      // with default table-row positioning, in order
      // to determine natural col widths with aid of
      // browser's rendering engine
      renderFakeTable(),

      // after that values are defined, render proper
      // table using ReactDom.render in componentDidUpdate
      state.table ? state.table : null
    ]}
  </div>
}

export default DsTable;
