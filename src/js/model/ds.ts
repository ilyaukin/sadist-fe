import { ReactNode } from "react";

export type Grouping = {
  key: string;
  selected?: boolean;
};

export type FilteringValue = string | number | null;

export type Filtering = {
  key: string;
  values?: FilteringValue[];
};

/**
 info on table column:
 - column name
 - possible and applied grouping and filtering
 (todo: move to DS info, cos grouping can sequentially use different columns...)
 */
export interface ColInfo {
  name: string;
  groupings?: Grouping[];
  filterings?: Filtering[];
}

/**
 * meta information about DS, such as name, owner etc.
 */
export interface DsMeta {
  /**
   * Ds's unique ID
   */
  id?: string;

  /**
   * Unique name
   */
  name?: string;

  /**
   * Type of the DS source
   */
  type?: string;

  /**
   * Columns' name in the specific order
   */
  cols?: string[];

  /**
   * Status of analysis of column types,
   */
  classification?: {
    /**
     * "finished" if analysis is finished
     */
    status?: string;

    /**
     * Date&time when classification started
     */
    started?: Date;

    /**
     * Estimated analysis time in milliseconds
     */
    estimated?: number;
  }

  /**
   * Status of analysis of each column and labels assigned to it,
   * such as "number" or "currency" or other specifying a type of column's detailed value
   */
  detailization?: {
    [col: string]: { status?: string; labels?: string[]; };
  }
}

/**
 * information about DS and its columns,
 * such as recognized column types,
 * possible and applied gropings and filterings
 */
export interface DsInfo {
  /**
   * Meta info on ds, can be retrieved by /ls API
   */
  meta?: DsMeta;

  /**
   * See {@link ColInfo}
   */
  colInfo?: ColInfo[];

  /**
   * If the visualization data must be imperatively updated
   * because of update of DS info. It was introduced cos
   * not all DS info object updates actually change visualisation,
   * e.g. changing filter, getting info on newly recognizing columns
   * etc. shouldn't cause unnecessary visualization requests.
   */
  shouldUpdateVisualization?: boolean;

  /**
   * Error of retrieving {@link meta}
   */
  err?: string;

  /**
   * Initialize {@link colInfo} given new {@link meta},
   * when a user selects the other DS or DS processing on the server updates
   * @param meta {@link meta} returned by the server
   * @return {ColInfo[]} initial {@link ColInfo}s
   */
  initColInfo({ meta }: { meta: DsMeta }): ColInfo[];

  /**
   * Get grouping on given column by given key (a.k.a. label)
   * @param col
   * @param key
   * @return {Grouping} if any
   */
  getGrouping(col: string, key: string): Grouping | undefined;

  /**
   * Select grouping by given col and key and deselect all others
   * @param col
   * @param key
   * @returns new {@link colInfo}
   */
  applyGrouping(col: string, key: string): ColInfo[];

  /**
   * get "visualization pipeline", not to be confused
   * with mongo's aggregation pipeline
   * @returns {[]} of visualization pipeline items, format TBD
   */
  getPipeline(): any;

  /**
   * get list of filtering values for given column
   * @param col column name
   * @param key filtering key
   * @return {string[]} filtering values
   */
  getFilteringValues(col: string, key: string): FilteringValue[] | undefined;

  /**
   * set list of filtering values for given column
   * @param col column name
   * @param key filtering key
   * @param values filtering values
   * @return new {@link colInfo}
   */
  applyFiltering(col: string, key: string, values: FilteringValue[]): ColInfo[];

  /**
   * Drop filtering by given column
   * @param col column name
   * @return new {@link colInfo}
   */
  dropFiltering(col: string): ColInfo[];

  /**
   * get filtering query
   * @returns {[]} (`query` argument) for /ds/{}/filter API.
   * if no filtering, return undefined.
   */
  getFilteringQuery(): any;

  /**
   * Get hint for visualisation of the given DS, which is displayed
   * if none of the visualisation options yet selected.
   * @return {ReactNode} peace of react tree
   */
  getHint(): ReactNode;

  /**
   * Return if {@link meta} is final i.e. all server-side analysis is done
   * and no need to query DS status again
   * @return {boolean} if it's final
   */
  isFinal(): boolean;
}
