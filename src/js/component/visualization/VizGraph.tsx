import React, {
  CSSProperties,
  Dispatch,
  useEffect,
  useRef,
  useState
} from 'react';
import equal from 'deep-equal';
import { Bar, BarChart, Cell, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ncolor } from '/wired-elements/lib/wired-lib';
import {
  ColSpecificProps,
  Filter,
  MultiselectFilter,
  RangeFilter,
  VizData,
  VizDataItem,
  VizMeta
} from '../../model/ds';
import { DsInfoAction, DsInfoActionType } from '../../reducer/dsInfo-reducer';

interface VizGraphProps {
  style?: CSSProperties;
  meta: VizMeta;
  data?: VizData;
  id?: any;
  name?: string;
  label?: string;
  selected?: boolean;
  filters?: Filter[];
  dispatchDsInfo?: Dispatch<DsInfoAction>;
}

interface VizGraphState {
  width?: number;
  height?: number;
}

const VizGraph = (props: VizGraphProps) => {

  const [state, setState] = useState<VizGraphState>({});
  const wrapper = useRef<HTMLDivElement | null>();

  useEffect(() => {
    const rect = wrapper.current?.getBoundingClientRect();
    let width = rect?.width;
    let height = rect?.height;
    // before initial height is set, let use default value
    if (width && height === 0) {
      height = Math.floor(240);
    }
    setState({ width: width, height: height });
  }, []);

  // on the first render determine width and height to pass to
  // rechart components.
  if (state.width == undefined || state.height == undefined) {
    return <div ref={(element) => {
      wrapper.current = element;
    }} style={{ width: '100%', height: '100%' }}></div>;
  }

  let {
    meta, filters, dispatchDsInfo
  } = props;

  let { width, height } = state;

  function error(message: string) {
    return <div className="error">
      <p>Error: <strong>{message}</strong> occured while rendering graph:</p>
      <pre>{JSON.stringify(meta)}</pre>
    </div>
  }

  /**
   * Recursively render graph.
   *
   * @param style
   * @param name
   * @param meta
   * @param data
   * @param selected
   */
  function renderGraph({ style, name, meta, data }: VizGraphProps) {
    name ||= meta.key;

    // In recharts, data is not explicitly passed downstream,
    // instead, each child graph is just a data key.
    const children = Object.entries(meta.children || {}).map(([k, v], index) => {
      return renderGraph({
        style: { fill: ncolor(index) },
        name: k,
        meta: v,
        data
      });
    });

    switch (meta.type) {
        // case 'marker':
        //   if (typeof data !== 'number') {
        //     return error('Data for "marker" must be a number');
        //   }
        //
        //   return <>
        //     <wired-marker
        //         style={style}
        //         data-id={id}
        //         data-name={name}
        //         data-value={data}
        //         data-label={label}
        //         selected={selected}
        //     />
        //   </>;

      case 'bar':
        return <>
          return <Bar
            fill={style?.fill}
            dataKey={name}
            onClick={onSelected}
        >
          {data && data instanceof Array && data.map((item, index) => <Cell
              cursor="pointer" opacity={isSelected(item) ? 1 : .6}
              key={index}/>)}
        </Bar>
        </>;

      case 'histogram':
        if (!( data instanceof Array )) {
          return error('Data for "histogram" must be an array');
        }

        return <>
          <BarChart width={width} height={height} style={style} data={data}>
            <XAxis dataKey={meta.labelselector || 'id'}/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            {children}
          </BarChart>
        </>;

        // case 'globe':
        //   return <>
        //     <wired-globe style={style} onselected={onSelected}>
        //       {children}
        //     </wired-globe>
        //   </>;

      default:
        return error(`Rendering of ${meta.type} not implemented`);
    }
  }

  let filter: Filter | undefined,
      isSelected: (arg0: VizDataItem) => boolean | undefined,
      onSelected: ( (data: VizDataItem, index: number, event: React.MouseEvent<SVGPathElement, MouseEvent>) => void ) | undefined;
  filter = filters?.find(f =>
      ( f.type === 'multiselect' || f.type === 'range' )
      && f.col === ( meta.props as ColSpecificProps ).col
      && f.label === ( meta.props as ColSpecificProps ).label);
  if (filter && filter.type === 'multiselect') {
    isSelected = (v): boolean => !!( filter as MultiselectFilter<any> ).selected.find(i => equal(i, v.id));
    onSelected = ({ id }, _index, e): void => {
      if (id) {
        if (e.shiftKey) {
          ( filter as MultiselectFilter<any> ).selected.push(id);
        } else {
          ( filter as MultiselectFilter<any> ).selected = [id];
        }
        dispatchDsInfo?.({
          type: DsInfoActionType.APPLY_FILTER,
        });
      }
    };
  }

  if (filter && filter.type === 'range') {
    isSelected = (v) => {
      const range = v.id.range;
      return range && range[0] != undefined && range[1] != undefined &&
          typeof range[0] == 'number' && typeof range[1] == 'number' &&
          !( filter as RangeFilter ).all &&
          !( filter as RangeFilter ).uncategorized &&
          !( filter as RangeFilter ).outliers &&
          ( filter as RangeFilter ).range_min <= range[0] &&
          range[1] <= ( filter as RangeFilter ).range_max;
    };
    onSelected = ({ id }, _index, e): void => {
      const range = id.range;
      if (range && range[0] != undefined && range[1] != undefined &&
          typeof range[0] == 'number' && typeof range[1] == 'number') {
        if (e.shiftKey) {
          ( filter as RangeFilter ).range_min = Math.min(( filter as RangeFilter ).range_min, range[0]);
          ( filter as RangeFilter ).range_max = Math.max(( filter as RangeFilter ).range_max, range[1]);
        } else {
          ( filter as RangeFilter ).range_min = range[0];
          ( filter as RangeFilter ).range_max = range[1];
        }
        ( filter as RangeFilter ).all = false;
        ( filter as RangeFilter ).uncategorized = false;
        ( filter as RangeFilter ).outliers = false;
        dispatchDsInfo?.({
          type: DsInfoActionType.APPLY_FILTER,
        });
      }
    };
  }

  return renderGraph(props);
}

export default VizGraph;
