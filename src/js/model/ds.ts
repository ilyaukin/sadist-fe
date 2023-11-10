/**
 * Type of visualization such as histogram, trend, timeline etc.,
 * that will be extended while implementing
 */
export type VizType =
  'marker' |
  'bar' |
  'histogram' |
  'globe';

/**
 * Type of action of visualization data retrieving,
 * such as group or calculate percentile
 */
export type VizAction =
  'accumulate' |
  'group';

/**
 * Any value that can appear in the DS
 */
export type ValueType = string | number | boolean | null;

/**
 * Address of a cell in the table.
 * In format row id, column number on name
 */
export type CellType = [string | number, string | number];

/**
 * {@link Predicate} that matches exact value
 */
export interface EqPredicate<T> {
  op: 'eq';
  value: T;
}

/**
 * {@link Predicate} that matches on of values in the list
 */
export interface InPredicate<T> {
  op: 'in';
  values: T[];
}

/**
 * Predicate that matches string value by inclusion
 */
export interface InStrPredicate<T> {
  op: 'instr';
  value: T;
}

/**
 * Part of meta information about group or filter.
 * Will be extended while implementing
 */
export type Predicate<T = ValueType> =
  EqPredicate<T> |
  InPredicate<T> |
  InStrPredicate<T>;

/**
 * Properties specific to a table column
 */
export interface ColSpecificProps {
  /**
   * column for grouping or filter
   */
  col: string;
  /**
   * the label key in the classification collection for the given
   * column; classified (detailed) value by this key is used instead of column value;
   * if not specified, column value directly is used
   */
  label?: string;
  /**
   * the predicate which defines if the row get into result,
   * e.g. we may want to group values inside 3 sigma interval only;
   * if not specified, all rows are used.
   */
  predicate?: Predicate;
}

/**
 * Properties of "accumulate" action
 */
export type AccumulateProps = (ColSpecificProps | {}) & {
  action: 'accumulate';
  /**
   * function which reduces values to the single accumulated
   * value, one of pre-defined or custom (TBD)
   */
  accumulater?: 'count' | 'mean' | 'min' | 'max' | 'average';
}

//not implemented yet
export type Reducer = never;

/**
 * Properties of "group" action
 */
export type GroupProps = (ColSpecificProps | {}) & {
  action: 'group';
  /**
   * function which reduces groups i.e. defines which value goes
   * to which group; for example we may want to divide the interval to 10
   * sub-intervals and group values within them;
   * if not specified, each value makes its own group
   */
  reducer?: Reducer;
}

/**
 * Properties of visualization data retrieving,
 * such as interval and granularity for grouping ect.
 */
export type VizProps = AccumulateProps | GroupProps;

/**
 * Meta information about visualization which defines
 * both visualization pipeline request to the server and
 * (together with visualization data from the server) rendering.
 * Visualization is a hierarchy of graphs, e.g. a histogram
 * has a child graph of type bar or several of them, which
 * positioning and style are defined by the parent graph
 * but rendering is defined by the child graph and data is
 * defined by the visualization data on a child level
 */
export interface VizMeta {
  /**
   * Key of the visualization graph, if many
   * of them appears on the same level. Can be used
   * in the hints, legend etc.
   */
  key: string;
  /**
   * visualization type, see {@link VizType}
   */
  type: VizType;
  /**
   * properties of visualization, depending on the type
   */
  props: VizProps;
  /**
   * child graphs
   */
  children?: { [k: string]: VizMeta };

  /**
   * String representation is used in UI
   */
  toString(): string;

  /**
   * Label of the visualization item in the graph.
   * If not defind, id will be used
   * @param i visualization data item
   */
  getLabel?(i: VizDataItem): string;
}

/**
 * Item of {@link VizPipeline}
 */
export interface VizPipelineItem {
  action: string;
  [prop: string]: any;
}

/**
 * Visualization pipeline which is visualization request parameter
 */
export type VizPipeline = VizPipelineItem[];

/**
 * Item of visualization data returned by server,
 * if grouping was requested
 */
export interface VizDataItem {
  id: any;
  [k: string]: VizData;
}

/**
 * Visualization data returned by server
 */
export type VizData = VizDataItem[] | number;

/**
 * Meta information about a filter applied to DS
 */
export type Filter = ColSpecificProps;

/**
 * Filter builder/generator, which is a mutable object
 * that can produce a filter. For example, a list of values which
 * a user ticks filtered values from
 */
export interface AbstractFilterProposal {
  propose(): Filter;
}

/**
 * Filter by selecting one or more of multiple values
 */
export interface MultiselectFilterProposal<T = ValueType> extends AbstractFilterProposal {
  type: 'multiselect';
  col: string;
  label: string;
  values: T[];
  selected: T[];
  getLabel?(item: T): string;
}

/**
 * Filter by searching (normally text)
 */
export interface SearchFilterProposal<T = string> extends AbstractFilterProposal {
  type: 'search';
  term?: T;
}

/**
 * Type of the classified values
 */
export type ComplexValueType = { id: ValueType; [p: string]: any; } | null;

/**
 * Any of known {@link AbstractFilterProposal} types
 */
export type FilterProposal =
  MultiselectFilterProposal<ValueType> |
  MultiselectFilterProposal<ComplexValueType> |
  SearchFilterProposal;

/**
 * Item of {@link FilterQuery}
 */
export type FilterQueryItem = Filter;

/**
 * Filter query which is filter request parameter to the server
 */
export type FilterQuery = FilterQueryItem[];

/**
 * Meta information about DS, such as name, owner, column types etc.
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
 * All information about DS, including DS meta information,
 * visualization and filtering
 */
export interface DsInfo {
  /**
   * Meta info on ds, can be retrieved by /ls API
   */
  meta: DsMeta;

  /**
   * Proposed visualization
   */
  vizMetaProposed?: VizMeta[];

  /**
   * Proposed visualization for each column
   */
  vizMetaProposedByCol?: { [col: string]: VizMeta[]; };

  /**
   * Visualization selected by a user, can be combined as Lego
   * by hints on column drop-downs or on visualization area
   */
  vizMeta?: VizMeta;

  /**
   * Proposed filters
   */
  filterProposals?: FilterProposal[];

  /**
   * Proposed filters by column
   */
  filterProposalsByCol?: { [col: string]: FilterProposal[]; }

  /**
   * Filters selected by a user
   */
  filters?: Filter[];

  /**
   * Error of retrieving {@link meta}
   */
  err?: string;

  /**
   * Cell selected by default
   */
  anchor?: CellType;

  /**
   * Initialize the {@link DsInfo} object given new {@link meta},
   * when a user selects the other DS or DS processing on the server updates.
   *
   * ***WARNING*** it can use some intellectual algorithm to map meta
   * to the available visualization and filters, better to invent some
   * meta-language to describe it in a declarative manner.
   * @param info can contain {@link meta} returned by the server,
   * pre-set visualization and filters
   * @return new copy of the object
   */
  init(info: Partial<DsInfo>): DsInfo;

  /**
   * Add proposed graph to visualization.
   * Can append as a child, or replace, or do some custom logic,
   * depending on graph's nature.
   * @param vizMeta
   */
  appendViz(vizMeta: VizMeta): VizMeta | undefined;

  /**
   * Check if a certain graph is included to the current
   * visualization
   * @param vizMeta
   */
  isVizSelected(vizMeta: VizMeta): boolean;

  /**
   * Get visualization pipeline
   */
  getPipeline(): VizPipeline | undefined;

  /**
   * Apply a particular filter to the table
   * @param filter
   */
  applyFilter(filter: Filter): Filter[] | undefined;

  /**
   * Drop a particular filter
   * @param filter
   */
  dropFilter(filter: Filter): Filter[] | undefined;

  /**
   * Get filter query to the server
   */
  getFilterQuery(): FilterQuery | undefined;

  /**
   * If {@link meta} is final, i.e. all server-side processing of the DS is done
   */
  isMetaFinal(): boolean;
}
