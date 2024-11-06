import equal from 'deep-equal'
import {
  CellType,
  DsInfo,
  DsMeta,
  Filter,
  FilterProposal,
  FilterQuery,
  FilterQueryItem,
  MultiselectFilter, RangeFilter,
  SearchFilter,
  VizMeta,
  VizPipeline
} from '../model/ds';
import { __as } from '../helper/type-helper';
import { select } from '../helper/json-helper';
import ColMultiselectFilter from '../component/ds/ColMultiselectFilter';
import ColSearch from '../component/ds/ColSearch';
import ColRangeFilter from '../component/ds/ColRangeFilter';

/**
 * Make functional filter out of filter proposal or just serialized filter
 * @param f Filter/filter proposal
 * @return {Filter}
 */
export const filterFactory = (f: FilterProposal | Filter): Filter => {
  switch (f.type) {
    case 'multiselect':
      return {
        ...f,
        'selected': ( f as MultiselectFilter<any> ).selected || [],
        'q'(): FilterQueryItem | undefined {
          if (!this.selected.length) {
            return undefined;
          }
          return {
            'col': this.col,
            'label': this.valuefield || this.label,
            'predicate': {
              'op': 'in',
              'values': this.selected.map(v => select(this.valueselector, v) || null),
            }
          }
        },
        render: ColMultiselectFilter,
      } as MultiselectFilter<any>;
    case 'range':
      return {
        ...f,
        range_min: ( f as RangeFilter ).range_min != undefined ?
            ( f as RangeFilter ).range_min : f.min,
        range_max: ( f as RangeFilter ).range_max != undefined ?
            ( f as RangeFilter ).range_max : f.max,
        all: ( f as RangeFilter ).all != undefined ?
            ( f as RangeFilter ).all : true,
        uncategorized: ( f as RangeFilter ).uncategorized != undefined ?
            ( f as RangeFilter ).uncategorized : false,
        outliers: ( f as RangeFilter ).outliers != undefined ?
            ( f as RangeFilter ).outliers : false,
        q() {
          if (this.all) {
            return undefined;
          }
          if (this.uncategorized) {
            return {
              col: this.col,
              label: this.label,
              predicate: { op: 'eq', value: null },
            };
          }
          if (this.outliers) {
            return {
              col: this.col,
              label: this.label,
              predicate: {
                op: 'or', expression: [
                  { op: 'lt', value: this.min },
                  { op: 'gte', value: this.max },
                ]
              },
            };
          }
          return {
            col: this.col,
            label: this.label,
            predicate: {
              op: 'inrange',
              range_min: this.range_min,
              range_max: this.range_max,
            }
          }
        },
        render: ColRangeFilter,
      } as RangeFilter;
    case 'search':
      return {
        ...f,
        q(): FilterQueryItem | undefined {
          if (!this.term) {
            return undefined;
          }
          return {
            col: '*', /* all columns */
            predicate: {
              op: 'instr',
              value: this.term || '',
            }
          };
        },
        render: ColSearch,
      } as SearchFilter;
  }
}

/**
 * Default object containing all functions of {@link DsInfo}
 */
export const defaultDsInfo: DsInfo = __as<DsInfo>({

  meta: {},

  init({ meta, vizMeta, filters, anchor }: DsInfo): DsInfo {
    const dsInfo = this.meta.id != meta.id ?
        { ...defaultDsInfo, meta, vizMeta, filters, anchor } : {
          ...defaultDsInfo,
          meta,
          vizMeta: this.vizMeta,
          filters: this.filters,
        };

    // propose viz & filters
    const __proposeViz = (col: string, v: VizMeta) => {
      ( dsInfo.vizMetaProposed ||= [] ).push(v);
      ( ( dsInfo.vizMetaProposedByCol ||= {} )[col] ||= [] ).push(v);
    }
    const __proposeFilter = (col: string, f: Filter) => {
      if (!f) {
        return;
      }
      ( dsInfo.filters ||= [] ).push(f);
      ( ( dsInfo.filtersByCol ||= {} )[col] ||= [] ).push(f);
    }
    if (meta.visualization) {
      Object.entries(meta.visualization).forEach(([col, vizMetas]) => {
        vizMetas.forEach((vizMeta) => {
          __proposeViz(col, vizMeta);
        });
      });
    }
    if (meta.filtering) {
      Object.entries(meta.filtering).forEach(([col, filterProposals]) => {
        filterProposals.forEach((filterProposal) => {
          __proposeFilter(col, filterFactory(filterProposal))
        });
      });
    }

    return dsInfo;
  },

  appendViz(vizMeta: VizMeta): VizMeta | undefined {
    // default accumulater if no other one selected
    const tail: { [key: string]: VizMeta } = {
      count: {
        key: 'count',
        type: vizMeta.type === 'histogram' ? 'bar' : 'marker',
        props: {
          action: 'accumulate',
          accumulater: 'count',
        },
      }
    };

    // check if we should use that default one
    const hasChildren = this.vizMeta?.children &&
        !this.isVizSelected(tail['count'])

    switch (vizMeta.props.action) {

        // if user selects a group, replace the exising group, if any,
        // (no group of group such as histogram of histogram or
        // a graph which point itself is a graph/chart so far
      case 'group':
        return {
          ...vizMeta,
          children: hasChildren ? this.vizMeta!.children : tail
        }
        // if user selects accumulated value, add it to the group,
        // if any, or create a null-group
      case 'accumulate':
        return {
          ...( this.vizMeta || {
            key: 'root',
            type: 'histogram',
            props: {
              action: 'group',
            }
          } ),
          children: {
            ...( hasChildren ? this.vizMeta!.children : {} ),
            [vizMeta.key]: vizMeta
          }
        };

      default:
        console.error(`Failure of adding ${vizMeta.key}`);
        return this.vizMeta;
    }
  },

  isVizSelected(vizMeta: VizMeta): boolean {
    // match vizMeta by props
    return this.__rolloutVizMeta((_key: string, v: VizMeta) => equal(vizMeta.props, v.props));
  },

  getPipeline(): VizPipeline | undefined {
    let pipeline: VizPipeline | undefined;

    function __appendItem(key: string, vizMeta: VizMeta) {
      ( pipeline = pipeline || [] ).push({ key, ...vizMeta.props });
    }

    this.__rolloutVizMeta(__appendItem);

    return pipeline;
  },

  getFilterQuery(): FilterQuery | undefined {
    let ff = this.filters?.map(f => f.q()).filter(f => f);
    return ff?.length ? ff as FilterQueryItem[] : undefined;
  },

  isMetaFinal(): boolean {
    if (this.err) {
      // no automatic update if got an error once
      return true;
    }

    let { classification, detailization } = this.meta;
    classification = classification || {};
    detailization = detailization || {};

    return classification.status === 'finished' &&
        Object.entries(detailization)
            .map(kv => kv[1].status === 'finished')
            .reduce((a, b) => a && b, true);
  },

  setViz(vizMeta: VizMeta) {
    // Just set vizMeta; proposed viz's won't affect by it.
    this.vizMeta = vizMeta;
  },

  setFilters(filters: Filter[]) {
    // 1. Each filter must be initialized by filterFactory.
    // 2. Since proposed filters are stored in the same mutable objects,
    // update them too.
    this.filters = [];
    this.filtersByCol = {};
    for (let filter of filters) {
      const f = filterFactory(filter);
      if (!f) {
        continue;
      }
      this.filters.push(f);
      if ('col' in f) {
        ( this.filtersByCol[f.col] ||= [] ).push(f);
      }
    }
  },

  __rolloutVizMeta: function (callback: (key: string, vizMeta: VizMeta) => any): any {
    // roll out tail recursion
    if (this.vizMeta) {
      let entries: [string, VizMeta][] = [[this.vizMeta.key, this.vizMeta]];
      while (entries.length) {
        for (const e of entries) {
          // stop roll out at the first truthy value returned by callback
          const result = callback(...e);
          if (result) {
            return result;
          }
        }
        entries = entries
            .map(([, v]) => v)
            .filter(v => v.children)
            .map(v => Object.entries(v.children!))
            .reduce((ee0, ee1) => ee0.concat(ee1), []);
      }
    }
  },
});

export function reduceDsInfo(dsInfo: DsInfo, action: DsInfoAction): DsInfo {
  switch (action.type) {
    case DsInfoActionType.SELECT_DS:
      return dsInfo.init({
        meta: action.meta,
        vizMeta: action.vizMeta,
        filters: action.filters,
        anchor: action.anchor,
      });

    case DsInfoActionType.ADD_VIZ:
      return {
        ...dsInfo,
        vizMeta: dsInfo.appendViz(action.vizMeta),
      };

    case DsInfoActionType.APPLY_FILTER:
      // apply all current filters (object fields wan't change.
      // but since filters are mutable, we make a copy of object to
      // trigger re-render)
      return {
        ...dsInfo,
      };

    case DsInfoActionType.UPDATE_META_SUCCESS:
      // dsId has changed so the meta is irrelevant
      if (dsInfo.meta.id !== action.meta.id) {
        return dsInfo;
      }

      // not to cause unnecessary re-rendering
      if (equal(dsInfo.meta, action.meta)) {
        return dsInfo;
      }

      return dsInfo.init({ meta: action.meta });

    case DsInfoActionType.UPDATE_META_ERROR:
      return {
        ...dsInfo,
        err: action.err,
      };

    case DsInfoActionType.SET_ANCHOR:
      return {
        ...dsInfo,
        anchor: action.anchor,
      };

    case DsInfoActionType.SET_FILTERS:
      dsInfo = { ...dsInfo };
      dsInfo.setFilters(action.filters);
      return dsInfo;

    case DsInfoActionType.SET_VIZ:
      dsInfo = { ...dsInfo };
      dsInfo.setViz(action.vizMeta);
      return dsInfo;

    default:
      console.error(`Can't dispatch action: ${JSON.stringify(action)}`);
      return dsInfo;
  }
}

/**
 * Types of actions that can be dispatched to reduce dsInfo
 */
export enum DsInfoActionType {

  /**
   * DS was selected in the DS list
   */
  SELECT_DS,

  /**
   * Grouping by certain col was selected
   */
  ADD_VIZ,

  /**
   * Filter was updated
   */
  APPLY_FILTER,

  /**
   * Updated status of the selected DS
   */
  UPDATE_META_SUCCESS,

  /**
   * Error of updating status of the selected DS
   */
  UPDATE_META_ERROR,

  /**
   * Select/anchor a cell
   */
  SET_ANCHOR,

  /**
   * Set filters directly as JSON
   */
  SET_FILTERS,

  /**
   * Set vizMeta directly as JSON
   */
  SET_VIZ,
}

export type DsInfoAction = {
  type: DsInfoActionType.SELECT_DS | DsInfoActionType.UPDATE_META_SUCCESS;
  meta: DsMeta;
  vizMeta?: VizMeta;
  filters?: Filter[];
  anchor?: CellType;
} | {
  type: DsInfoActionType.ADD_VIZ;
  vizMeta: VizMeta;
} | {
  type: DsInfoActionType.APPLY_FILTER;
} | {
  type: DsInfoActionType.UPDATE_META_ERROR;
  err?: string;
} | {
  type: DsInfoActionType.SET_ANCHOR;
  anchor: CellType;
} | {
  type: DsInfoActionType.SET_FILTERS;
  filters: Filter[];
} | {
  type: DsInfoActionType.SET_VIZ;
  vizMeta: VizMeta;
}