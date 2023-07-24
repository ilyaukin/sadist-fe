import React, { Component } from "react";
import { WiredInput } from '/wired-elements/lib/wired-input';
import Or from '../common/Or';
import GoogleSheetList from './GoogleSheetList';
import ValidationError from "./ValidationError";

interface GoogleSheetProviderScreenProps {
  onUpdateScreens?: () => void;
}

interface GoogleSheetProviderScreenState {
  selectedRadio: 'list' | 'url';
  selectedSheet?: gapi.client.drive.File;
  listError?: string;
  urlError?: string;
}

class GoogleSheetProviderScreen extends Component<GoogleSheetProviderScreenProps, GoogleSheetProviderScreenState> {
  private urlInput?: WiredInput | null;

  constructor(props: GoogleSheetProviderScreenProps) {
    super(props);
    this.state = {
      selectedRadio: 'list',  // 'list' or 'url'
      selectedSheet: undefined,  // sheet selected in the list
      listError: undefined,
      urlError: undefined,
    }
  }

  componentDidMount() {
    if (this.props.onUpdateScreens) {
      this.props.onUpdateScreens();
    }
  }

  componentDidUpdate(_prevProps: Readonly<GoogleSheetProviderScreenProps>, prevState: Readonly<GoogleSheetProviderScreenState>, _snapshot?: any) {
    if (this.props.onUpdateScreens && prevState?.selectedRadio !== this.state.selectedRadio) {
      this.props.onUpdateScreens();
    }
    if (this.state.selectedRadio === 'url') {
      this.urlInput!.focus();
    }
  }

  isList(): boolean {
    const { selectedRadio } = this.state;
    return selectedRadio === 'list';
  }

  getSheet(): Promise<gapi.client.drive.File> {
    const { selectedSheet } = this.state;
    return new Promise((resolve, reject) => {
      let message = 'Please select sheet';
      this.setState({
            ...this.state,
            listError: selectedSheet ? undefined : message
          },
          () => selectedSheet ? resolve(selectedSheet) : reject(new ValidationError(message)));
    });
  }

  getSheetUrl(): Promise<string> {
    // here we can get direct link to the selected sheet
    // but it **LIKELY** will be blocked by browser's cross-site policy
    const { selectedSheet } = this.state;
    return new Promise((resolve, reject) => {
      let message = 'Please select sheet';
      this.setState({
            ...this.state,
            listError: selectedSheet?.id ? undefined : message
          },
          () => selectedSheet?.id ?
              resolve(`https://docs.google.com/spreadsheets/d/${selectedSheet.id}/htmlview`) :
              reject(new ValidationError(message)));
    });
  }

  getDirectUrl(): Promise<string> {
    const url = this.urlInput?.value;
    return new Promise((resolve, reject) => {
      const ok = url && url.startsWith('https://docs.google.com/spreadsheets/');
      const message = 'Please enter a valid URL starting with ' +
          'https://docs.google.com/spreadsheets/';
      this.setState({ ...this.state, urlError: ok ? undefined : message },
          () => ok ? resolve(url) : reject(new ValidationError(message)));
    });
  }

  getUrl(): Promise<string> {
    return this.isList() ? this.getSheetUrl() : this.getDirectUrl();
  }

  onRadioSelected = (radio: 'list' | 'url', event: CustomEvent) => {
    if (event.detail.checked) {
      this.setState({
        ...this.state,
        selectedRadio: radio
      });
    }
  }

  onSheetSelected = (sheet: gapi.client.drive.File, event: CustomEvent) => {
    event.stopPropagation();
    this.setState({
      ...this.state,
      selectedRadio: 'list',
      selectedSheet: sheet
    });
  }

  onFocusUrl = () => {
    this.setState({ ...this.state, selectedRadio: 'url' });
  }

  render() {
    const {
      listError,
      urlError
    } = this.state;
    return <div style={{ width: '100%' }}>
        <wired-radio
            name="google-sheet-radio"
            value="list"
            checked={this.isList()}
            onchange={(event) => this.onRadioSelected('list', event)}
        >Select a Sheet
        </wired-radio>
        <GoogleSheetList onSheetSelected={this.onSheetSelected}/>
        {listError ? <span className="field-error">{listError}</span> : ''}
        <Or/>
        <wired-radio
            name="google-sheet-radio"
            value="url"
            checked={!this.isList()}
            onchange={(event) => this.onRadioSelected('url', event)}
        >Enter URL:
        </wired-radio>
        <wired-input
            ref={input => this.urlInput = input}
            style={{ width: '100%' }}
            id="url"
            onFocus={this.onFocusUrl}
        />
        {urlError ? <span className="field-error">{urlError}</span> : ''}
    </div>;
  }
}

export default GoogleSheetProviderScreen;
