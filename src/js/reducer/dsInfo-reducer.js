import moment from 'moment'
import equal from 'deep-equal'
import CountDownClock from '../component/visualization/CountDownClock'
import React from 'react'

/**
 * A factory that returns fresh dsInfo object.

 * @param meta Meta info on ds, can be retrieved by /ls API
 * @param colSpecs see types.colSpecs
 * TODO change data structure?
 * @param err Error on retrieving DS meta
 * @param shouldUpdateVisualization if should call refresh() on Visualization
 */
const buildDsInfo = function ({
  meta,
  colSpecs,
  err,
  shouldUpdateVisualization
} = {
  meta: {},
  colSpecs: [],
  shouldUpdateVisualization: false
}) {

  return {
    meta,
    colSpecs,
    err,
    shouldUpdateVisualization,

    buildColSpecs: function ({ meta }) {
      if (!meta?.cols) {
        return [];
      }

      let colSpecs = meta.cols.map(col => ({ name: col }))

      if (meta.detailization) {
        Object.entries(meta.detailization)
          .filter(kv => kv[1].status === 'finished')
          .forEach(kv => {
            let col = kv[0]
            let colSpec = colSpecs.find(colSpec => colSpec.name === col)
            let labels = kv[1].labels
            if (labels) {
              for (let label of labels) {
                // if grouping is already known, keep it the same
                (colSpec.groupings = colSpec.groupings || [])
                  .push(this.getGrouping(col, label) || { key: label })
              }
            }
          })
      }

      return colSpecs
    },

    getGrouping: function (col, label) {
      return this.colSpecs
        ?.find(colSpec => colSpec.name === col)
        ?.groupings
        ?.find(grouping => grouping.key === label)
    },

    /**
     * Select grouping by given col and key and deselect all others
     * @param col
     * @param key
     * @returns new colSpecs
     */
    applyGrouping: function (col, key) {
      return this.colSpecs
        .map((colSpec) => ({
          ...colSpec, groupings: colSpec.groupings?.map(grouping => ({
            ...grouping, selected: col === colSpec.name && key === grouping.key
          }))
        }))
    },

    /**
     * get "visualization pipeline", not to be confused
     * with mongo's aggregation pipeline
     * @param types.colSpecs
     * @returns [] of visualization pipeline items, format TBD
     */
    getPipeline: function () {
      let pipeline = []

      // 1. grouping
      let selectedGrouping
      let colSpec = this.colSpecs.find(colSpec =>
        selectedGrouping = colSpec.groupings?.find(grouping => grouping.selected))
      if (colSpec && selectedGrouping) {
        pipeline.push({
          col: colSpec.name,
          key: selectedGrouping.key,
        })
      }

      // 2., ... accumulated values
      // todo

      return pipeline
    },

    /**
     * get list of filtering values for given column
     * @param colSpecs {@see types.colSpecs}
     * @param col column name
     * @param key filtering key
     * @return filtering values
     */
    getFilteringValues: function (col, key) {
      return this.colSpecs.find(colSpec => colSpec.name === col)
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
    applyFiltering: function (col, key, values) {
      return this.colSpecs.map(colSpec => colSpec.name === col ? {
        ...colSpec,
        filterings: [{ key, values }]
      } : colSpec)
    },

    /**
     * Drop filtering by given column
     * @param col column name
     */
    dropFiltering: function (col) {
      return this.colSpecs.map(colSpec => {
        if (colSpec.name === col) {
          colSpec = { ...colSpec }
          delete colSpec['filterings']
        }
        return colSpec
      })
    },

    /**
     * get filtering query
     * @returns [] (`query` argument) for /ds/{}/filter API.
     * if no filtering, return undefined.
     */
    getFilteringQuery: function() {
      let query = [];
      this.colSpecs.forEach(colSpec => {
        if (colSpec.filterings) {
          colSpec.filterings.forEach(filtering => {
            query.push({
              col: colSpec.name,
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

    getHint: function ({ clockTimeout, onClockTimeout }) {
      // check error
      if (this.err) {
        return <p>Failed to get status ({this.err}). Please refresh the page.</p>
      }

      // display status of classification
      let { classification, detailization } = this.meta
      classification = classification || {}
      detailization = detailization || {}
      let hint = []
      if (classification.status !== 'finished') {
        hint.push(
          <p>Please wait while data classification is done.</p>
        )
        if (classification.status) {
          hint.push(
            <p>Status: {classification.status}</p>
          )
          if (classification.started && classification.estimated) {
            let finished_estimation = moment(classification.started)
              .add(classification.estimated, 'millisecond')
            if (!clockTimeout) {
              hint.push(
                <p><CountDownClock
                  to={finished_estimation}
                  onClockTimeout={onClockTimeout}
                /> left</p>
              )
            } else {
              hint.push(
                <p>Seems classification needs too much time or it's hung,
                  please contact&nbsp;
                  <a
                    href="mailto:kzerby@gmail.com"
                    target="_blank">developer
                  </a>
                </p>
              )
            }
          }
        }

        return hint
      }

      // display status of columns detailization
      let detailizationByCol = Object.entries(detailization)
      if (!detailizationByCol.length) {
        return <p>Unfortunately, no columns are recognized as known data type.</p>
      }

      if (detailizationByCol.find((kv) => kv[1].status === 'finished')) {
        hint.push(
          <p>Please use dropdowns near the table columns, to visualize data.</p>
        )
      } else {
        hint.push(
          <p>Please wait while columns analysis is done.</p>
        )
      }
      hint.push(
        <p>Status:</p>
      )
      hint.push(
        <ul>{detailizationByCol.map((kv) => <li key={kv[0]}>{kv[0]}: {kv[1].status}</li>)}</ul>
      )
      return hint
    },

    isFinal: function () {
      let { classification, detailization } = this.meta
      classification = classification || {}
      detailization = detailization || {}

      return classification.status === 'finished' &&
        Object.entries(detailization)
          .map(kv => kv[1].status === 'finished')
          .reduce((a, b) => a && b, true)
    },
  }
}

/**
 * Types of actions that can be dispatched to reduce dsInfo
 */
const actionType = {

  /**
   * DS was selected in the DS list
   */
  SELECT_DS: 'SELECT_DS',

  /**
   * Grouping by certain col and key was selected
   */
  SELECT_GROUPING: 'SELECT_GROUPING',

  /**
   * Filter by certain col, key and values was selected
   */
  FILTER: 'FILTER',

  /**
   * Filter by certain col was dropped
   */
  DROP_FILTER: 'DROP_FILTER',

  /**
   * Updated status of the selected DS
   */
  UPDATE_STATUS_SUCCESS: 'UPDATE_STATUS_SUCCESS',

  /**
   * Error of updating status of the selected DS
   */
  UPDATE_STATUS_ERROR: 'UPDATE_STATUS_ERROR',
}

const reduceDsInfo = function (dsInfo, action) {
  switch (action.type) {
    case actionType.SELECT_DS:
      return buildDsInfo({
        meta: action.meta,
        colSpecs: dsInfo.buildColSpecs({ meta: action.meta }),
        shouldUpdateVisualization: true
      })

    case actionType.SELECT_GROUPING:
      if (dsInfo.getGrouping(action.col, action.key)?.selected) {
        // already selected
        return dsInfo
      }
      return {
        ...dsInfo,
        colSpecs: dsInfo.applyGrouping(action.col, action.key),
        shouldUpdateVisualization: true
      }

    case actionType.FILTER:
      return {
        ...dsInfo,
        colSpecs: dsInfo.applyFiltering(action.col, action.key, action.values),
        shouldUpdateVisualization: false
      }

    case actionType.DROP_FILTER:
      return {
        ...dsInfo,
        colSpecs: dsInfo.dropFiltering(action.col),
        shouldUpdateVisualization: false
      }

    case actionType.UPDATE_STATUS_SUCCESS:
      // dsId has changed so the meta is irrelevant
      if (dsInfo.meta.id !== action.meta.id) {
        return dsInfo
      }

      // not to cause unnecessary re-rendering
      if (equal(dsInfo.meta, action.meta)) {
        return dsInfo
      }

      return buildDsInfo({
        meta: action.meta,
        colSpecs: dsInfo.buildColSpecs({ meta: action.meta }),
        shouldUpdateVisualization: false
      })

    case actionType.UPDATE_STATUS_ERROR:
      return {
        ...dsInfo,
        err: action.err,
        shouldUpdateVisualization: false
      }
  }

  console.error(`The action ${action.type} is cannot be dispatched, stay with the current state`)
  return dsInfo
}

export { buildDsInfo, actionType, reduceDsInfo }
