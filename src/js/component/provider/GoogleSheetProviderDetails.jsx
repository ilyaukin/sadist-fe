import React, { Component } from "react";
import '/packages/wired-input';

class GoogleSheetProviderDetails extends Component {
  render() {
    return <div>
      URL:<br/>
      <wired-input style={{ width: '100%' }} ref={(url) => {
        // console.log(this)
        return this.url = url;
      }} autofocus id="url"/>
    </div>;
  }
}

export default GoogleSheetProviderDetails;
