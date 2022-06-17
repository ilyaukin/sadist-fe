import React, { Component } from "react";
import PropTypes from "prop-types";
import { VectorMap } from "react-jvectormap";
import equal from 'deep-equal';
import '../../../css/jquery-jvectormap.css'

// medium marker radius
const MID_R = 10;

// maximum marker radius
const MAX_R = 50;

// minimum marker radius
const MIN_R = 3;

export class GeoMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 'auto'
    };
    this.setPoints(props.result)
  }

  setPoints(result) {
    this.points = result.filter(point => point.id?.name && point.id?.coordinates)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.result != nextProps.result) {
      this.setPoints(nextProps.result);
    }

    return !equal(this.state, nextState) ||
      this.props.result != nextProps.result;
  }

  componentDidMount() {
    if (this.state.height.endsWith('px')) {
      // already know height in px, malatsa!
      return;
    }

    let { width, height, defaultWidth, defaultHeight } = this.map.getMapObject();

    // adjust height of container so it will have fit by width
    // with actual map proportion
    let proportion = defaultHeight / defaultWidth;
    height = `${Math.ceil(width * proportion)}px`;

    this.setState({ height });
  }

  componentWillUnmount() {
    let { onDropFiltering } = this.props;
    onDropFiltering();

    if (this.map) {
      this.map.getMapObject().remove();
    }
  }

  onMarkerClick = (event, code) => {
    let { onUpdateFilteringValues } = this.props;

    // make current marker selected and all others unselected.
    // todo: handle "shift" to select multiple markers
    let keys = {};
    for (let i = 0; i < this.points.length; i++) {
      keys[i] = i == code;
    }
    this.map.getMapObject().setSelectedMarkers(keys);
    onUpdateFilteringValues(this.points
      .filter((point, i) => keys[i])
      .map(point => point.id.id));
  }

  render() {

    // 1st run w/o markers to tackle height
    let dry = this.state.height === 'auto';

    let getMarkerLabel = (point) => point.id.name;

    let getMarkerRadius = () => MID_R;

    // if "count" is present in data points, we'll show
    // marker proportionally sqrt of "count" value
    // (to make square proportionally to count), with median 10px,
    // but the largest one no more than 50px
    let hasCount = this.points.length && this.points[0].count;
    if (hasCount && !dry) {
      let values = this.points.map(point => Math.sqrt(point.count));
      values.sort((a, b) => a - b);
      let median = values[Math.floor(values.length / 2)];
      let markerScale = MID_R / median;
      if (values[values.length - 1] * markerScale > MAX_R) {
        markerScale = MAX_R / values[values.length - 1];
      }
      getMarkerLabel = (point) => `${point.id.name}: ${point.count}`;
      getMarkerRadius = (point) => point.count ?
        Math.max(Math.round(Math.sqrt(point.count) * markerScale), MIN_R) :
        MID_R;

    }
    let markers = dry ? [] : this.points.map(
      point => {
        // in GeoJSON pairs are (lng, lat)
        let [long, lat] = point.id.coordinates;
        return {
          name: getMarkerLabel(point),
          latLng: [lat, long],
          style: {
            r: getMarkerRadius(point)
          }
        };
      });

    return <div className="map-container" ref={container => this.container = container}>
      <VectorMap
        ref={map => this.map = map}
        map="world_mill"
        containerStyle={{
          width: '100%',
          height: this.state.height
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
        onMarkerClick={this.onMarkerClick}
      />
    </div>;
  }
}

GeoMap.propTypes = {
  result: PropTypes.array.isRequired,
  onUpdateFilteringValues: PropTypes.func.isRequired,
  onDropFiltering: PropTypes.func.isRequired
};