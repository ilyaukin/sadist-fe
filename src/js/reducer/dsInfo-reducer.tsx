import equal from 'deep-equal'
import {
  ComplexValueType,
  DsInfo,
  DsMeta,
  Filter,
  FilterProposal,
  FilterQuery,
  MultiselectFilterProposal,
  VizDataItem,
  VizMeta,
  VizPipeline
} from '../model/ds';

/**
 * Default object containing all functions of {@link DsInfo}
 */
export const defaultDsInfo: DsInfo = {

  meta: {},

  init(meta: DsMeta): DsInfo {
    const dsInfo = this.meta.id != meta.id ? { ...defaultDsInfo, meta } : {
      ...defaultDsInfo,
      meta,
      vizMeta: this.vizMeta,
      filters: this.filters
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
    if (meta.detailization) {
      Object.entries(meta.detailization).forEach(([col, details]) => {
        if (details.status === 'finished' && details.labels) {
          details.labels.forEach((label) => {
            switch (label) {
              case 'city':
                __proposeViz(col, {
                  key: `${col} city`,
                  type: 'globe',
                  props: {
                    action: 'group',
                    col: col,
                    label: 'city',
                  },
                  toString() {
                    return 'Show cities';
                  },
                  getLabel(i: VizDataItem): string {
                    return `${i.id?.name}`;
                  }
                });
                __proposeFilter(col, {
                  type: 'multiselect',
                  col,
                  label,
                  values: [],
                  selected: [],
                  propose(): Filter {
                    return {
                      col,
                      label: `${label}.id`,
                      predicate: {
                        op: 'in',
                        values: (this as MultiselectFilterProposal<ComplexValueType>).selected.map(v => v?.id || null),
                      }
                    }
                  },
                  getLabel(item: ComplexValueType): string {
                    return `${item?.name}`;
                  }
                });
                break;
              case 'country':
                __proposeViz(col, {
                  key: `${col} country`,
                  type: 'globe',
                  props: {
                    action: 'group',
                    col: col,
                    label: 'country',
                  },
                  toString(): string {
                    return 'Show counties';
                  },
                  getLabel(i: VizDataItem): string {
                    return `${i.id?.name}`;
                  }
                });
                __proposeFilter(col, {
                  type: 'multiselect',
                  col,
                  label,
                  values: [],
                  selected: [],
                  propose(): Filter {
                    return {
                      col,
                      label: `${label}.id`,
                      predicate: {
                        op: 'in',
                        values: (this as MultiselectFilterProposal<ComplexValueType>).selected.map(v => v?.id || null),
                      }
                    }
                  },
                  getLabel(item: ComplexValueType): string {
                    return `${item?.name}`;
                  }
                });
                break;
              case 'number':
                __proposeViz(col, {
                  key: `${col} average`,
                  type: 'bar',
                  props: {
                    action: 'accumulate',
                    col: col,
                    label: 'number',
                    accumulater: 'average',
                  },
                  toString(): string {
                    return 'Show average';
                  }
                });
                __proposeViz(col, {
                  key: `${col} min`,
                  type: 'bar',
                  props: {
                    action: 'accumulate',
                    col: col,
                    label: 'number',
                    accumulater: 'min',
                  },
                  toString(): string {
                    return 'Show minimum';
                  }
                });
                __proposeViz(col, {
                  key: `${col} max`,
                  type: 'bar',
                  props: {
                    action: 'accumulate',
                    col: col,
                    label: 'number',
                    accumulater: 'max',
                  },
                  toString(): string {
                    return 'Show maximum';
                  }
                });
                break;
            }
          });
        }
      });
      // // let it be text filters by all cols across so far,
      // // at least to test filtering engine
      // meta.cols?.forEach((col) => {
      //   __proposeFilter(col, {
      //     type: 'search',
      //     propose(): Filter {
      //       return {
      //         col: col,
      //         predicate: {
      //           op: 'instr',
      //           value: this.term || '',
      //         }
      //       };
      //     }
      //   });
      // });
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
        }
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
            ...(equal(this.vizMeta?.children, tail) ? {} : this.vizMeta?.children),
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
    return this.filters?.filter(f => !( f.col == filter.col && f.label == filter.label ));
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
};

export function reduceDsInfo(dsInfo: DsInfo, action: DsInfoAction): DsInfo {
  switch (action.type) {
    case DsInfoActionType.SELECT_DS:
      return action.meta ? dsInfo.init(action.meta) : dsInfo;

    case DsInfoActionType.ADD_VIZ:
      return action.vizMeta ? {
        ...dsInfo,
        vizMeta: dsInfo.appendViz(action.vizMeta),
      } : dsInfo;

    case DsInfoActionType.ADD_FILTER:
      return action.filter ? {
        ...dsInfo,
        filters: dsInfo.applyFilter(action.filter),
      } : dsInfo;

    case DsInfoActionType.DROP_FILTER:
      return action.filter ? {
        ...dsInfo,
        filters: dsInfo.dropFilter(action.filter),
      } : dsInfo;

    case DsInfoActionType.UPDATE_STATUS_SUCCESS:
      // dsId has changed so the meta is irrelevant
      if (dsInfo.meta.id !== action.meta?.id) {
        return dsInfo;
      }

      // not to cause unnecessary re-rendering
      if (equal(dsInfo.meta, action.meta)) {
        return dsInfo;
      }

      return action.meta ? dsInfo.init(action.meta) : dsInfo;

    case DsInfoActionType.UPDATE_STATUS_ERROR:
      return {
        ...dsInfo,
        err: action.err,
      };
  }

  console.error(`The action ${action.type} is cannot be dispatched, stay with the current state`);
  return dsInfo;
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
  UPDATE_STATUS_SUCCESS,

  /**
   * Error of updating status of the selected DS
   */
  UPDATE_STATUS_ERROR,
}

export interface DsInfoAction {
  type: DsInfoActionType;
  meta?: DsMeta;
  vizMeta?: VizMeta;
  filter?: Filter;
  err?: string;
}