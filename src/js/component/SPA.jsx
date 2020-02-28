import '@webcomponents/custom-elements'
import React, { Component } from 'react';
import DsList from './ds/DsList';
import './index.css';
import ErrorDialog from "./common/ErrorDialog";
import DsTable from "./ds/DsTable";
import { renderPage } from "../helper/react-helper";

class SPA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dsId: null,
      ds: []
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

  setDsId = (value, d) => {
    const { cols } = d;
    this.setState({ dsId: value, cols });
  }

  setDs = (value) => {
    this.setState({ ds: value });
  }

  render() {
    const { dsId, cols, ds, err } = this.state;
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
        <DsTable dsId={dsId} cols={cols} onLoadDs={this.setDs} ds={ds}/>
      </div>
    );
  }

}

export default SPA;

renderPage(<SPA />);
