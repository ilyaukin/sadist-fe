import React, { Component } from 'react';

interface AccessScreenProps {
}

type AccessType = 'public' | 'private';

interface AccessScreenState {
  selectedType: AccessType;
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

  onSelected = (type: AccessType, event: CustomEvent) => {
    if (event.detail.checked) {
      this.setState({ selectedType: type });
    }
  }

  render() {
    return <div className="radio-group">
      <wired-radio id="access-type-public" name="access-type" value="public"
                   onchange={(event) => this.onSelected('public', event)}>
        <div>
          Public
        </div>
        <div>
        <span
            className="comment">Data source will be accessible to everyone.</span>
        </div>
      </wired-radio>
      <wired-radio id="access-type-private" name="access-type" value="private"
                   onchange={(event) => this.onSelected('private', event)}>
        <div>
          Private
        </div>
        <div>
        <span className="comment">Data source will be accessible only by you
        once you're logged in.</span>
        </div>
      </wired-radio>
    </div>;
  }
}

export default AccessScreen;
