import React, { CSSProperties, Dispatch, ReactNode } from 'react';
import equal from 'deep-equal';
import {
  ColSpecificProps,
  Filter,
  MultiselectFilter,
  VizData,
  VizDataItem,
  VizMeta
} from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';
import { select } from '../../helper/json-helper';

interface VizGraphProps {
  style?: CSSProperties;
  meta: VizMeta;
  data: VizData;
  id: any;
  name?: string;
  label?: string;
  selected?: boolean;
  filters?: Filter[];
  dispatchDsInfo?: Dispatch<DsInfoAction>;
}

const VizGraph = (props: VizGraphProps) => {

  let {
    style, meta, data, id, name, label, selected,
    filters, dispatchDsInfo
  } = props;
  name ||= meta.key;

  function error(message: string) {
    return <div className="error">
      <p>Error: <strong>{message}</strong> occured while rendering graph:</p>
      <pre>{JSON.stringify(meta)}</pre>
    </div>
  }

  let children: ReactNode = null, filter: Filter | undefined,
      isSelected: (arg0: VizDataItem) => boolean | undefined,
      onSelected: ( (e: CustomEvent) => void ) | undefined;
  if (data instanceof Array && meta.children) {
    filter = filters?.find(f =>
        f.type === 'multiselect'
        && f.col === ( meta.props as ColSpecificProps ).col
        && f.label === ( meta.props as ColSpecificProps ).label);
    if (filter) {
      isSelected = (v: VizDataItem): boolean =>
          !!( filter as MultiselectFilter<any> ).selected.find(i => equal(i, v.id));
      onSelected = (e: CustomEvent): void => {
        e.stopPropagation();
        const id = e.detail.id;
        if (id) {
          if (e.detail.sourceEvent.shiftKey) {
            ( filter as MultiselectFilter<any> ).selected.push(id);
          } else {
            ( filter as MultiselectFilter<any> ).selected = [id];
          }
          dispatchDsInfo?.({
            type: DsInfoActionType.APPLY_FILTER,
          });
        }
      }
    }

    children = data.map((item, i) => {
      return Object.entries(meta.children!).map(([k, v]) => {
        return <>
          <VizGraph
              key={`${i}-${k}`}
              meta={v}
              data={item[k]}
              id={item.id}
              name={k}
              label={select(meta.labelselector, item) || item.id}
              selected={isSelected?.(item)}
          />
        </>
      });
    });
  }

  switch (meta.type) {
    case 'marker':
      if (typeof data !== 'number') {
        return error('Data for "marker" must be a number');
      }

      return <>
        <wired-marker
            style={style}
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
            selected={selected}
        />
      </>;

    case 'bar':
      if (typeof data !== 'number') {
        return error('Data for "bar" must be a number');
      }

      return <>
        <wired-bar
            style={style}
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
            selected={selected}
        />
      </>;

    case 'histogram':
      return <>
        <wired-histogram style={style} onselected={onSelected}>
          {children}
        </wired-histogram>
      </>;

    case 'globe':
      return <>
        <wired-globe style={style} onselected={onSelected}>
          {children}
        </wired-globe>
      </>;

    default:
      return error(`Rendering of ${meta.type} not implemented`);
  }

}

export default VizGraph;
