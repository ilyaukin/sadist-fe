import React, { Component } from 'react';

interface AccessScreenProps {
}

interface AccessScreenState {
  selectedType: 'public' | 'private';
}

class AccessScreen extends Component<AccessScreenProps, AccessScreenState> {

  constructor(props: AccessScreenProps) {
    super(props);
    this.state = {
      selectedType: 'public',
    };
  }

  getType() {
    return this.state.selectedType;
  }

  onSelected = (event: CustomEvent) => {
    this.setState({ selectedType: event.detail.selected });
  }

  render() {
    const { selectedType } = this.state;

    return <div>
      <wired-radio-group selected={selectedType} onselected={this.onSelected}>
        <wired-radio name="public">Public</wired-radio><br/>
        <span className="comment">Data source will be accessible to everyone.</span><br/><br/>
        <wired-radio name="private">Private</wired-radio><br/>
        <span className="comment">Data source will be accessible only by you
        once you're logged in.</span><br/><br/>
      </wired-radio-group>
    </div>;
  }
}

export default AccessScreen;
