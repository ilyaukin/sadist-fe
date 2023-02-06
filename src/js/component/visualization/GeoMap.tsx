import React, { useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore
import { VectorMap } from "react-jvectormap";
import '../../../css/jquery-jvectormap.css'
import { FilteringValue } from '../../model/ds';

// medium marker radius
const MID_R = 10;

// maximum marker radius
const MAX_R = 50;

// minimum marker radius
const MIN_R = 3;

interface Point {
  id?: {
    id: any;
    name: string;
    coordinates: [number, number];
  };
  count?: number;
}

interface GeoMapProps {
  result: Point[];
  filteringValues: FilteringValue[] | undefined,
  onUpdateFilteringValues: (values: FilteringValue[]) => any;
  onDropFiltering: () => any;
}

interface GeoMapState {
  height: string;
}

const GeoMap = ({ result, filteringValues, onUpdateFilteringValues, onDropFiltering }: GeoMapProps) => {
  const [state, setState] = useState<GeoMapState>({
    height: 'auto'
  });

  const points: Point[] = result.filter(point => point.id?.name && point.id?.coordinates)

  const map = useRef<any>(null);

  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (state.height.endsWith('px')) {
      // already know height in px, malatsa!
      return;
    }

    let { width, height, defaultWidth, defaultHeight } = map.current.getMapObject();

    // adjust height of container so it will have fit by width
    // with actual map proportion
    let proportion = defaultHeight / defaultWidth;
    height = `${Math.ceil(width * proportion)}px`;

    setState({ height });
  }, [state.height]);

  useEffect(() => {
    if (state.height === 'auto') {
      return;
    }

    // make only filtered values selected
    const keys: { [i: number]: boolean } = {};
    points.forEach((point, index) => {
      keys[index] = filteringValues ? filteringValues.indexOf(point.id?.id) !== -1 : false;
    });
    map.current.getMapObject().setSelectedMarkers(keys);
  }, [filteringValues, state.height]);

  // @ts-ignore
  const onMarkerClick = (event: Event, code: number) => {
    // make current marker selected and all others unselected.
    // todo: handle "shift" to select multiple markers
    let keys: { [i: number]: boolean } = {};
    for (let i = 0; i < points.length; i++) {
      keys[i] = i == code;
    }
    map.current.getMapObject().setSelectedMarkers(keys);
    onUpdateFilteringValues(points
      // @ts-ignore
      .filter((point, i) => keys[i])
      .map(point => point.id!.id));
  }

  // 1st run w/o markers to tackle height
  const dry = state.height === 'auto';

  let getMarkerLabel = (point: Point) => point.id!.name;

  // @ts-ignore
  let getMarkerRadius = (point: Point) => MID_R;

  // if "count" is present in data points, we'll show
  // marker proportionally sqrt of "count" value
  // (to make square proportionally to count), with median 10px,
  // but the largest one no more than 50px
  let hasCount = points.length && points[0].count;
  if (hasCount && !dry) {
    let values = points.map(point => Math.sqrt(point.count!));
    values.sort((a, b) => a - b);
    let median = values[Math.floor(values.length / 2)];
    let markerScale = MID_R / median;
    if (values[values.length - 1] * markerScale > MAX_R) {
      markerScale = MAX_R / values[values.length - 1];
    }
    getMarkerLabel = (point: Point) => `${point.id!.name}: ${point.count}`;
    getMarkerRadius = (point: Point) => point.count ?
      Math.max(Math.round(Math.sqrt(point.count) * markerScale), MIN_R) :
      MID_R;
  }
  let markers = dry ? [] : points.map(
    point => {
      // in GeoJSON pairs are (lng, lat)
      let [long, lat] = point.id!.coordinates;
      return {
        name: getMarkerLabel(point),
        latLng: [lat, long],
        style: {
          r: getMarkerRadius(point)
        }
      };
    });

  function render() {
    return <div className="map-container" ref={container}>
      <VectorMap
        ref={map}
        map="world_mill"
        containerStyle={{
          width: '100%',
          height: state.height
        }}
        markers={markers}
        markerStyle={{
          initial: {
            fill: 'blue'
          },
          hover: {
            fill: 'blue',
            stroke: 'black',
            'stroke-width': 4,
            cursor: 'pointer'
          },
          selected: {
            fill: 'red'
          }
        }}
        onMarkerClick={onMarkerClick}
      />
    </div>;
  }

  return useMemo(render, [result, state]);
}

export default GeoMap;
