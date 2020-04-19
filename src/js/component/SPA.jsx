import '@webcomponents/custom-elements'
import React, { Component } from 'react';
import equal from 'deep-equal';
import DsList from './ds/DsList';
import './index.css';
import ErrorDialog from "./common/ErrorDialog";
import DsTable from "./ds/DsTable";
import Visualization from "./visualization/Visualization";
import { renderPage } from "../helper/react-helper";

class SPA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dsId: null,
      meta: {},
      ds: [],
      colSpecs: []
    };
    ErrorDialog.raise = (err) => this.setState({ err });
    ErrorDialog.close = () => this.setState({ err: undefined });
  }

  getTitle() {
    const titles = [
      'My handicapped pet project....',
      'Let steal the beggars!',
    ];
    const choose = Math.floor(Math.random() * titles.length);
    return titles[choose];
  }

  buildColSpecs({ meta }) {
    let colSpecs = meta.cols.map(col => ({ name: col }));

    if (meta.detailization) {
      Object.entries(meta.detailization)
        .filter(kv => kv[1].status === 'finished')
        .forEach(kv => {
          let col = kv[0];
          let colSpec = colSpecs.find(colSpec => colSpec.name === col);
          let labels = kv[1].labels;
          if (labels) {
            for (let label of labels) {
              // if grouping is already known, keep it the same
              let grouping = this.state?.colSpecs
                ?.find(colSpec => colSpec.name === col)
                ?.groupings
                ?.find(grouping => grouping.key === label);

              (colSpec.groupings = colSpec.groupings || [])
                .push(grouping || { key: label });
            }
          }
        });
    }

    return colSpecs;
  }

  setDsId = (dsId, meta) => {
    this.setState({ dsId, meta, colSpecs: this.buildColSpecs({ meta }) });
  }

  updateDsMeta = (dsId, meta) => {
    // update Meta for given DS
    if (dsId !== this.state.dsId) {
      // dsId has changed so the meta is irrelevant
      // todo what if state changed between check and set?
      return false;
    }
    if (equal(meta, this.state.meta)) {
      // return true but don't call setState in order
      // not to cause unnecessary re-rendering
      return true;
    }
    this.setState({ meta, colSpecs: this.buildColSpecs({ meta }) });
    return true;
  }

  updateColSpec = (colSpec) => {
    // todo
    // here we just put new col spec, but actually
    // we should check constraints and update other
    // col specs if needed. e.g. grouping of type 'city'
    // can be only one to show at one map
    const colSpecs = this.state.colSpecs
      .map(storedColSpec => storedColSpec.name === colSpec.name ? colSpec : storedColSpec);

    this.setState({ colSpecs });
  }

  setDs = (value) => {
    this.setState({ ds: value });
  }

  renderVisualization() {
    const { dsId, meta, colSpecs } = this.state;
    if (!dsId) {
      return '';
    }

    return <div>
      <wired-divider/>

      <h2>2. Visualize</h2>
      <Visualization
        dsId={dsId}
        meta={meta}
        setMeta={this.updateDsMeta}
        colSpecs={colSpecs}
        onUpdateColSpec={this.updateColSpec}
      />
    </div>;
  }

  render() {
    const { dsId, colSpecs, ds, err } = this.state;
    return (
      <div className="content">
        <ErrorDialog err={err}/>
        <h1>
          {this.getTitle()}
        </h1>
        <wired-divider/>

        <h2>1. Get the data</h2>
        {/*list existing data source using /ls api*/}
        <DsList onDsSelected={this.setDsId}/>
        {/*show top from selected ds*/}
        <DsTable
          dsId={dsId}
          colSpecs={colSpecs}
          onUpdateColSpec={this.updateColSpec}
          onLoadDs={this.setDs}
          ds={ds}
        />

        {this.renderVisualization()}
      </div>
    );
  }
}

export default SPA;

renderPage(<SPA/>);
