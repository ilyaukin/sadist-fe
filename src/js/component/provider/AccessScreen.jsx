import React, { Component } from 'react';
import WiredRadioGroup from '../common/WiredRadioGroup';
import WiredRadio from '../common/WiredRadio';

class AccessScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedType: 'public',
    };
  }

  getType() {
    return this.state.selectedType;
  }

  onSelected = (event) => {
    this.setState({ selectedType: event.detail.selected });
  }

  render() {
    const { selectedType } = this.state;

    return <div>
      <WiredRadioGroup selected={selectedType} onSelected={this.onSelected}>
        <WiredRadio name="public">Public</WiredRadio><br/>
        <span className="comment">Data source will be accessible to everyone.</span><br/><br/>
        <WiredRadio name="private">Private</WiredRadio><br/>
        <span className="comment">Data source will be accessible only by you
        once you're logged in.</span><br/><br/>
      </WiredRadioGroup>
    </div>;
  }
}

export default AccessScreen;
