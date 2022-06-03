import React, { Component } from 'react';
import { isVal } from "../../helper/wired-helper";
import IProvider from "../provider/IProvider";
import ValidationError from "../provider/ValidationError";
import NullProvider from "../provider/NullProvider";
import GoogleSheetProvider from "../provider/GoogleSheetProvider";
import ErrorDialog from "../common/ErrorDialog";
import PropTypes from "prop-types";
import { Loader } from "../common/Loader";
import DelayedRender from "../common/DelayedRender";

class DsNew extends Component {
  _nullProvider = new NullProvider();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      provider: this._nullProvider
    };
    this.providers = [
      new GoogleSheetProvider()
    ];
  }

  componentDidUpdate() {
    if (this.combo) {
      this.combo.addEventListener('selected', (e) => this.onProviderSelected(e, e.detail?.selected));
    }
  }

  onProviderSelected(event, value) {
    this.setState({
      provider:
        this.providers.find((p) => p.type === value) || this._nullProvider
    });
  }

  onCreate = () => {
    this.setState({ loading: true }, () => {
      this.state.provider.loadCSV().then((result) => {
        let data;
        data = new FormData();
        data.set('csv', result.csv, result.filename || 'Unnamed.csv');
        data.set('type', result.type);
        data.set('extra', JSON.stringify(result.extra));
        fetch('/ds', {
          method: 'PUT',
          body: data
        }).then((response) => {
          response.json()
            .then((data) => {
              if (data.success && data.item) {
                const { onDsCreated } = this.props;
                onDsCreated(data.item);
              } else {
                ErrorDialog.raise('Error saving data: ' + (data.error || 'Unknown error'));
              }
              this.setState({ loading: false });
            }).catch((e) => {
            ErrorDialog.raise('Error parsing json: ' + e.toString());
            this.setState({ loading: false });
          })
        }).catch((e) => {
          ErrorDialog.raise('Error putting data source: ' + e.toString());
          this.setState({ loading: false });
        })
      }).catch((e) => {
        if (e instanceof ValidationError) {
          //let user fix an error....
        } else {
          ErrorDialog.raise('Error fetching data source: ' + e.toString());
        }
        this.setState({ loading: false });
      });
    })
  }

  renderTypeCombo() {
    return <DelayedRender>
      Source Type:<br/>
      <wired-combo
        style={{ width: '100%' }}
        ref={(combo) => {
          this.combo = combo
        }}
      >
        {
          this.providers.map((provider) =>
            <wired-item value={provider.type} key={provider.type}>
              <img className="item" src={provider.icon} alt={provider.type}/>{provider.text}
            </wired-item>
          )
        }
      </wired-combo>
    </DelayedRender>
  }

  renderProviderDetails() {
    return this.state.provider.renderDetails();
  }

  render() {
    return <div className="new-dialog">
      <Loader loading={this.state.loading}/>
      <form>
        <div>
          <div className="left-pane">
            {this.renderTypeCombo()}
            <br/>
            {this.state.provider.renderDescription()}
          </div>
          <div className="right-pane">
            {this.renderProviderDetails()}
          </div>
        </div>
        <div className="button-pane">
          <wired-button
            disabled={isVal(!this.state.provider.type || this.state.loading)}
            onClick={this.onCreate}>Create
          </wired-button>
        </div>
      </form>
    </div>
  }
}

DsNew.propTypes = {
  onDsCreated: PropTypes.func
}

export default DsNew;
