import React, { ReactNode } from 'react'
import moment from 'moment'
import equal from 'deep-equal'
import CountDown from '../component/visualization/CountDown'
import { ColInfo, DsInfo, DsMeta, FilteringValue, Grouping } from '../model/ds';

/**
 * Define all functions of {@link DsInfo}
 * @param dsInfo data fields of the object
 * @return {DsInfo} object with given data and correct functions
 */
function initDsInfo(dsInfo: Partial<DsInfo>): DsInfo {
  return {
    ...dsInfo,

    initColInfo: function ({ meta }: { meta: DsMeta }): ColInfo[] {
      if (!meta?.cols) {
        return [];
      }

      const colInfo: ColInfo[] = meta.cols.map(col => ( { name: col } ));

      if (meta.detailization) {
        Object.entries(meta.detailization)
          .filter(kv => kv[1].status === 'finished')
          .forEach(kv => {
            let col = kv[0]
            let colInfo1 = colInfo.find(colSpec => colSpec.name === col)
            if (colInfo1) {
              let labels = kv[1].labels
              if (labels) {
                for (let label of labels) {
                  // if grouping is already known, keep it the same
                  ( colInfo1.groupings = colInfo1.groupings || [] )
                    .push(this.getGrouping(col, label) || { key: label })
                }
              }
            }
          })
      }

      return colInfo
    },

    getGrouping: function (col: string, label: string): Grouping | undefined {
      return this.colInfo
        ?.find(colInfo1 => colInfo1.name === col)
        ?.groupings
        ?.find(grouping => grouping.key === label);
    },

    /**
     * Select grouping by given col and key and deselect all others
     * @param col
     * @param key
     * @returns new colSpecs
     */
    applyGrouping: function (col: string, key: string): ColInfo[] {
      return this.colInfo!
        .map((colInfo1) => ( {
          ...colInfo1, groupings: colInfo1.groupings?.map(grouping => ( {
            ...grouping, selected: col === colInfo1.name && key === grouping.key
          } ))
        } ))
    },

    /**
     * get "visualization pipeline", not to be confused
     * with mongo's aggregation pipeline
     * @returns {[]} of visualization pipeline items, format TBD
     */
    getPipeline: function () {
      let pipeline = []

      // 1. grouping
      let selectedGrouping: Grouping | undefined
      let colInfo1 = this.colInfo!.find(colInfo1 =>
        selectedGrouping = colInfo1.groupings?.find(grouping => grouping.selected))
      if (colInfo1 && selectedGrouping) {
        pipeline.push({
          col: colInfo1.name,
          key: selectedGrouping.key,
        })
      }

      // 2., ... accumulated values
      // todo

      return pipeline
    },

    /**
     * get list of filtering values for given column
     * @param col column name
     * @param key filtering key
     * @return {string[]} filtering values
     */
    getFilteringValues: function (col: string, key: string): FilteringValue[] | undefined {
      return this.colInfo!.find(colInfo1 => colInfo1.name === col)
        ?.filterings?.find(filtering => filtering.key === key)
        ?.values
    },

    /**
     * set list of filtering values for given column
     * @param col column name
     * @param key filtering key
     * @param values filtering values
     * @return new colSpecs
     */
    applyFiltering: function (col: string, key: string, values: string[]): ColInfo[] {
      return this.colInfo!.map(colInfo1 => colInfo1.name === col ? {
        ...colInfo1,
        filterings: [{ key, values }]
      } : colInfo1)
    },

    /**
     * Drop filtering by given column
     * @param col column name
     */
    dropFiltering: function (col: string): ColInfo[] {
      return this.colInfo!.map(colInfo1 => {
        if (colInfo1.name === col) {
          colInfo1 = { ...colInfo1 }
          delete colInfo1['filterings']
        }
        return colInfo1
      })
    },

    /**
     * get filtering query
     * @returns {[]} (`query` argument) for /ds/{}/filter API.
     * if no filtering, return undefined.
     */
    getFilteringQuery: function () {
      let query: any[] = [];
      this.colInfo!.forEach(colInfo1 => {
        if (colInfo1.filterings) {
          colInfo1.filterings.forEach(filtering => {
            query.push({
              col: colInfo1.name,
              key: filtering.key,
              values: filtering.values
            });
          });
        }
      });

      if (!query.length) {
        return undefined;
      }

      return query;
    },

    getHint: function (): ReactNode {
      // check error
      if (this.err) {
        return <p>Failed to get status ({this.err}). Please
          refresh the page. </p>;
      }

      // display status of classification
      let { classification, detailization } = this.meta!;
      classification = classification || {};
      detailization = detailization || {};
      let hint = [];
      if (classification.status !== 'finished') {
        const p1 = <p>Please wait while data classification
          is done. </p>;
        if (classification.status) {
          const p2text = `Status: ${classification.status}`;
          if (classification.started && classification.estimated) {
            let finished_estimation = moment(classification.started)
              .add(classification.estimated, 'millisecond')
            const countDown = CountDown({ to: finished_estimation });
            hint.push(<countDown.Render
              before={
                <>
                  {p1}
                  <p>{p2text} (<countDown.Clock/> left)</p>
                </>
              }
              after={<p>Seems classification needs too much
                time or it's hung, please contact &nbsp;
                <a
                  href="mailto:kzerby@gmail.com"
                  target="_blank"> developer
                </a>
              </p>}
            />);
          } else {
            hint.push(p1);
            hint.push(<p>{p2text}</p>);
          }
        } else {
          hint.push(p1);
        }

        return hint;
      }

      // display status of columns detailization
      let detailizationByCol = Object.entries(detailization);
      if (!detailizationByCol.length) {
        return <p>Unfortunately, no columns are recognized as known
          data type. </p>;
      }

      if (detailizationByCol.find((kv) => kv[1].status === 'finished')) {
        hint.push(
          <p>Please use dropdowns near the table columns, to
            visualize data. </p>
        );
      } else {
        hint.push(
          <p>Please wait while columns analysis is done. </p>
        );
      }
      hint.push(
        <p>Status:</p>
      );
      hint.push(
        <ul>{detailizationByCol.map((kv) => <li key={kv[0]}> {kv[0]}: {kv[1].status}</li>)}</ul>
      );
      return hint;
    },

    isFinal: function (): boolean {
      if (this.err) {
        // no automatic update if got an error once
        return true;
      }

      let { classification, detailization } = this.meta!;
      classification = classification || {};
      detailization = detailization || {};

      return classification.status === 'finished' &&
        Object.entries(detailization)
          .map(kv => kv[1].status === 'finished')
          .reduce((a, b) => a && b, true);
    },
  };
}

export const defaultDsInfo: DsInfo = initDsInfo({
  meta: {},
  colInfo: [],
  shouldUpdateVisualization: false,
});

export function reduceDsInfo(dsInfo: DsInfo, action: DsInfoAction): DsInfo {
  switch (action.type) {
    case DsInfoActionType.SELECT_DS:
      return initDsInfo({
        meta: action.meta,
        colInfo: dsInfo.initColInfo({ meta: action.meta! }),
        shouldUpdateVisualization: true
      });

    case DsInfoActionType.SELECT_GROUPING:
      if (dsInfo.getGrouping(action.col!, action.key!)?.selected) {
        // already selected
        return dsInfo;
      }
      return {
        ...dsInfo,
        colInfo: dsInfo.applyGrouping(action.col!, action.key!),
        shouldUpdateVisualization: true
      };

    case DsInfoActionType.FILTER:
      return {
        ...dsInfo,
        colInfo: dsInfo.applyFiltering(action.col!, action.key!, action.values!),
        shouldUpdateVisualization: false
      };

    case DsInfoActionType.DROP_FILTER:
      return {
        ...dsInfo,
        colInfo: dsInfo.dropFiltering(action.col!),
        shouldUpdateVisualization: false
      };

    case DsInfoActionType.UPDATE_STATUS_SUCCESS:
      // dsId has changed so the meta is irrelevant
      if (dsInfo.meta!.id !== action.meta!.id) {
        return dsInfo;
      }

      // not to cause unnecessary re-rendering
      if (equal(dsInfo.meta!, action.meta!)) {
        return dsInfo;
      }

      return initDsInfo({
        meta: action.meta,
        colInfo: dsInfo.initColInfo({ meta: action.meta! }),
        shouldUpdateVisualization: false
      });

    case DsInfoActionType.UPDATE_STATUS_ERROR:
      return {
        ...dsInfo,
        err: action.err,
        shouldUpdateVisualization: false
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
   * Grouping by certain col and key was selected
   */
  SELECT_GROUPING,

  /**
   * Filter by certain col, key and values was selected
   */
  FILTER,

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
  col?: string;
  key?: string;
  values?: FilteringValue[];
  err?: string;
}