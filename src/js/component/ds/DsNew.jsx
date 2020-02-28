import React, { Component } from 'react';
import { isVal } from "../../helper/wired-helper";
import { GoogleSheetProviderDetails } from "../provider/GoogleSheetProviderDetails";
import NullProvider from "../provider/NullProvider";
import GoogleSheetProvider from "../provider/GoogleSheetProvider";
import ErrorDialog from "../common/ErrorDialog";
import * as PropTypes from "proptypes";
import { Loader } from "../common/Loader";

class DsNew extends Component {
  _nullProvider = new NullProvider();

  constructor(props) {
    super(props);
    this.state = {
      readyToRenderCombo: false,
      loading: false,
      provider: this._nullProvider
    };
    this.providers = [
      new GoogleSheetProvider()
    ];
  }

  componentDidMount() {
    // workaround to https://github.com/wiredjs/wired-elements/issues/114
    if (!this.combo) {
      setTimeout(() => this.setState({ readyToRenderCombo: true }), 1000);
      return;
    }
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
        ErrorDialog.raise('Error fetching data source: ' + e.toString());
        this.setState({ loading: false });
      });
    })
  }

  renderTypeCombo() {
    if (!this.state.readyToRenderCombo) {
      return '';
    }

    return <div>
      Source Type:<br/>
      <wired-combo
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
    </div>
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
          </div>
          <div className="right-pane">
            {this.renderProviderDetails()}
          </div>
        </div>
        <div className="button-pane">
          <wired-button
            disabled={isVal(!this.state.provider.type)}
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
