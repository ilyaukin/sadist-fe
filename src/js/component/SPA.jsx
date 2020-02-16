import '@webcomponents/custom-elements'
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { WiredDivider } from 'wired-elements';
import DsList from './ds/DsList';
import './index.css';
import ErrorDialog from "./common/ErrorDialog";

class SPA extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        ErrorDialog.raise = (err) => this.setState({ err });
        ErrorDialog.close = () => this.setState({ err: undefined });
    }

    render() {
        return (
            <div className="content">
                <ErrorDialog err={this.state.err}/>
                <h1>
                My handicapped pet project....
                </h1>
                <wired-divider/>

                <h2>1. Get the data</h2>
                {/*list existing data source using /ls api*/}
                <DsList />
            </div>
        );
    }

}

export default SPA;

const wrapper = document.getElementById('container');
wrapper ? ReactDom.render(<SPA />, wrapper) : false;
