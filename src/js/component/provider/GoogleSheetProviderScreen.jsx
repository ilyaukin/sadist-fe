import React, { Component } from "react";
import Or from '../common/Or';
import GoogleSheetList from './GoogleSheetList';
import WiredRadio from '../common/WiredRadio';
import WiredInput from '../common/WiredInput';
import WiredRadioGroup from '../common/WiredRadioGroup';
import ValidationError from "./ValidationError";
import PropTypes from 'prop-types';

class GoogleSheetProviderScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRadio: 'list',  // 'list' or 'url'
      selectedSheet: undefined,  // sheet selected in the list
      listError: undefined,
      url: undefined,
      urlError: undefined,
    }
  }

  componentDidMount() {
    if (this.props.onUpdateScreens) {
      this.props.onUpdateScreens();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.onUpdateScreens && prevState?.selectedRadio !== this.state.selectedRadio) {
      this.props.onUpdateScreens();
    }
  }

  isList() {
    const { selectedRadio } = this.state;
    return selectedRadio === 'list';
  }

  getSheet() {
    const { selectedSheet } = this.state;
    return new Promise((resolve, reject) => {
      let message = 'Please select sheet';
      this.setState({ ...this.state, listError: selectedSheet ? undefined : message },
        () => selectedSheet ? resolve(selectedSheet) : reject(new ValidationError(message)));
    });
  }

  getSheetUrl() {
    // here we can get direct link to the selected sheet
    // but it **LIKELY** will be blocked by browser's cross-site policy
    const { selectedSheet } = this.state;
    return new Promise((resolve, reject) => {
      let message = 'Please select sheet';
      this.setState({ ...this.state, listError: selectedSheet?.id ? undefined : message },
        () => selectedSheet?.id ?
          resolve(`https://docs.google.com/spreadsheets/d/${selectedSheet.id}/htmlview`) :
          reject(new ValidationError(message)));
    });
  }

  getDirectUrl() {
    const { url } = this.state;
    return new Promise((resolve, reject) => {
      const ok = url.startsWith('https://docs.google.com/spreadsheets/');
      const message = 'Please enter a valid URL starting with ' +
        'https://docs.google.com/spreadsheets/';
      this.setState({ ...this.state, urlError: ok ? undefined : message },
        () => ok ? resolve(url) : reject(new ValidationError(message)));
    });
  }

  getUrl() {
    return this.isList() ? this.getSheetUrl() : this.getDirectUrl();
  }

  onRadioSelected = (event) => {
    this.setState({ ...this.state, selectedRadio: event.detail.selected });
  }

  onSheetSelected = (sheet, event) => {
    event.stopPropagation();
    this.setState({ ...this.state, selectedRadio: 'list', selectedSheet: sheet });
  }

  onChangeUrl = (value) => {
    this.setState({ ...this.state, url: value });
  }

  onFocusUrl = () => {
    this.setState({ ...this.state, selectedRadio: 'url' });
  }

  render() {
    const {
      selectedRadio,
      listError,
      url,
      urlError
    } = this.state;
    return <div>
      <WiredRadioGroup
        style={{ width: '100%' }}
        selected={selectedRadio}
        onSelected={this.onRadioSelected}
      >
        <WiredRadio name="list">Select a Sheet</WiredRadio>
        <GoogleSheetList onSheetSelected={this.onSheetSelected}/>
        {listError ? <span className="field-error">{listError}</span>: ''}
        <Or/>
        <WiredRadio name="url">Enter URL:</WiredRadio><br/>
        <WiredInput
          style={{ width: '100%' }}
          id="url"
          value={url}
          onChange={this.onChangeUrl}
          focus={selectedRadio === 'url'}
          onFocus={this.onFocusUrl}
        />
        {urlError ? <span className="field-error">{urlError}</span> : ''}
      </WiredRadioGroup>
    </div>;
  }
}

GoogleSheetProviderScreen.propTypes = {
  onUpdateScreens: PropTypes.func,
}

export default GoogleSheetProviderScreen;
