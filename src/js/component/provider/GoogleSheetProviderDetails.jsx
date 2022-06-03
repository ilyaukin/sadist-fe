import React, { Component } from "react";
import '/packages/wired-input';
import ValidationError from "./ValidationError";

class GoogleSheetProviderDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      urlError: undefined,
    }
  }

  getUrl() {
    const url = this.url.value;
    return new Promise((resolve, reject) => {
      const ok = url.startsWith('https://docs.google.com/spreadsheets/');
      const message = 'Please enter a valid URL starting with ' +
        'https://docs.google.com/spreadsheets/';
      this.setState({ urlError: ok ? undefined : message },
        () => ok ? resolve(url) : reject(new ValidationError(message)));
    });
  }

  render() {
    const { urlError } = this.state;
    return <div>
      URL:<br/>
      <wired-input style={{ width: '100%' }} ref={(url) => {
        // console.log(this)
        return this.url = url;
      }} autofocus id="url"/>
      {urlError ? <span className="field-error">{urlError}</span> : ''}
    </div>;
  }
}

export default GoogleSheetProviderDetails;
