import React, {
  Dispatch,
  MouseEvent,
  MouseEventHandler,
  ReactNode
} from 'react';
import equal from 'deep-equal';
import {
  ColSpecificProps,
  FilterProposal,
  MultiselectFilterProposal,
  VizData,
  VizDataItem,
  VizMeta
} from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';

interface VizGraphProps {
  meta: VizMeta;
  data: VizData;
  id: any;
  name?: string;
  label?: string;
  selected?: boolean;
  onSelected?: MouseEventHandler;
  filterProposals?: FilterProposal[];
  dispatchDsInfo?: Dispatch<DsInfoAction>;
}

const VizGraph = (props: VizGraphProps) => {

  let {
    meta, data, id, name, label, selected, onSelected,
    filterProposals, dispatchDsInfo
  } = props;
  name ||= meta.key;

  function error(message: string) {
    return <div className="error">
      <p>Error: <strong>{message}</strong> occured while rendering graph:</p>
      <pre>{JSON.stringify(meta)}</pre>
    </div>
  }

  function renderChildren(): ReactNode {
    if (!( data instanceof Array )) {
      return error(`Data for "${meta.type}" is expected to be an array`);
    }

    if (!meta.children) {
      return null;
    }

    let filterProposal: FilterProposal | undefined,
        isSelected: (arg0: VizDataItem) => boolean | undefined,
        onSelected: ( (e: MouseEvent) => void ) | undefined;
    filterProposal = filterProposals?.find(f =>
        f.type === 'multiselect'
        && f.col === ( meta.props as ColSpecificProps ).col
        && f.label === ( meta.props as ColSpecificProps ).label);
    if (filterProposal) {
      isSelected = (v: VizDataItem): boolean =>
          !!( filterProposal as MultiselectFilterProposal ).selected.find(i => equal(i, v.id));
      onSelected = (e: MouseEvent): void => {
        const id = ( e.target as any )?.['data-id'];
        if (id) {
          if (e.shiftKey) {
            ( filterProposal as MultiselectFilterProposal ).selected.push(id);
          } else {
            ( filterProposal as MultiselectFilterProposal ).selected = [id];
          }
          dispatchDsInfo?.({
            type: DsInfoActionType.ADD_FILTER,
            filter: filterProposal?.propose()
          });
        }
      }
    }

    return data.map((item, i) => {
      return Object.entries(meta.children!).map(([k, v]) => {
        return <>
          <VizGraph
              key={`${i}-${k}`}
              meta={v}
              data={item[k]}
              id={item.id}
              name={k}
              label={meta.getLabel?.(item)}
              selected={isSelected?.(item)}
              onSelected={onSelected}
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
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
            selected={selected}
            onClick={onSelected}
        />
      </>;

    case 'bar':
      if (typeof data !== 'number') {
        return error('Data for "bar" must be a number');
      }

      return <>
        <wired-bar
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
            selected={selected}
            onClick={onSelected}
        />
      </>;

    case 'histogram':
      return <>
        <wired-histogram>
          {renderChildren()}
        </wired-histogram>
      </>;

    case 'globe':
      return <>
        <wired-globe>
          {renderChildren()}
        </wired-globe>
      </>;

    default:
      return error(`Rendering of ${meta.type} not implemented`);
  }

}

export default VizGraph;
