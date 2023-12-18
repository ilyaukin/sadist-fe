import equal from 'deep-equal'
import {
  CellType,
  DsInfo,
  DsMeta,
  Filter,
  FilterProposal,
  FilterQuery,
  MultiselectFilterProposal,
  SearchFilterProposal,
  VizMeta,
  VizPipeline
} from '../model/ds';
import { __as } from '../helper/type-helper';
import { select } from '../helper/json-helper';

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
    const __proposeFilter = (col: string, f: FilterProposal) => {
      ( dsInfo.filterProposals ||= [] ).push(f);
      ( ( dsInfo.filterProposalsByCol ||= {} )[col] ||= [] ).push(f);
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
          switch (filterProposal.type) {
            case 'multiselect':
              __proposeFilter(col, {
                ...filterProposal,
                propose(): Filter {
                  return {
                    col: this.col,
                    label: this.valuefield,
                    predicate: {
                      op: 'in',
                      values: this.selected.map(v => select(this.valueselector, v) || null),
                    }
                  }
                },
              } as MultiselectFilterProposal);
              break;
            case 'search':
              __proposeFilter(col, {
                ...filterProposal,
                propose(): Filter {
                  return {
                    col,
                    predicate: {
                      op: 'instr',
                      value: this.term || '',
                    }
                  };
                }
              } as SearchFilterProposal);
              break;
          }
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
        type: 'marker',
        props: {
          action: 'accumulate',
          accumulater: 'count',
        },
      }
    };

    switch (vizMeta.props.action) {

        // if user selects a group, replace the exising group, if any,
        // (no group of group such as histogram of histogram or
        // a graph which point itself is a graph/chart so far
      case 'group':
        return {
          ...vizMeta,
          children: this.vizMeta?.props.action === 'group' ? this.vizMeta.children : tail
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
            ...( equal(this.vizMeta?.children, tail) ? {} : this.vizMeta?.children ),
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

  applyFilter(filter: Filter): Filter[] | undefined {
    let ff = this.dropFilter(filter);
    return ff ? [...ff, filter] : [filter];
  },

  dropFilter(filter: Filter): Filter[] | undefined {
    let ff = this.filters?.filter(f => !( f.col == filter.col && f.label == filter.label ));
    return ff?.length ? ff : undefined;
  },

  getFilterQuery(): FilterQuery | undefined {
    return this.filters;
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

    case DsInfoActionType.ADD_FILTER:
      return {
        ...dsInfo,
        filters: dsInfo.applyFilter(action.filter),
      };

    case DsInfoActionType.DROP_FILTER:
      return {
        ...dsInfo,
        filters: dsInfo.dropFilter(action.filter),
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
      }
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
   * Filter by certain col was selected
   */
  ADD_FILTER,

  /**
   * Filter by certain col was dropped
   */
  DROP_FILTER,

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
  type: DsInfoActionType.ADD_FILTER | DsInfoActionType.DROP_FILTER;
  filter: Filter;
} | {
  type: DsInfoActionType.UPDATE_META_ERROR;
  err?: string;
} | {
  type: DsInfoActionType.SET_ANCHOR;
  anchor: CellType;
}