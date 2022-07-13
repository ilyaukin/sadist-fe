import React, { Component } from 'react';
import { isVal } from "../../helper/wired-helper";
import AbstractProvider from "../provider/AbstractProvider";
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
      provider: this._nullProvider,
      screenNo: 0,
    };
    const providerProps = {
      onUpdateScreens: this.onUpdateScreens,
    }
    this.providers = [
      new GoogleSheetProvider(providerProps),
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

  onNextScreen = () => {
    const { screenNo } = this.state;
    this.state.provider.validate(screenNo)
      .then(() => this.setState({ screenNo: screenNo + 1 }))
      .catch(() => {/* ignore. provider will display errors itself */});
  }

  onPrevScreen = () => {
    const { screenNo } = this.state;
    this.setState({ screenNo: screenNo - 1 });
  }

  onUpdateScreens = () => {
    // since provider can change its screens
    // count and disposition depending on previously filled values,
    // we should re-render the component if it happens,
    // state will be the same, just provider will return different screens
    this.forceUpdate();
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

  render() {
    const screens = this.state.provider.renderScreens();
    const { screenNo } = this.state;
    const v = b => b ? {} : { style: { display: 'none' } };

    const renderProviderSelector = () => {
      return <div key="selector" className="left-pane" {...v(screenNo === 0)}>
        {this.renderTypeCombo()}
        <br/>
        {this.state.provider.renderDescription()}
      </div>;
    };

    const renderProviderScreen = (screen, i) => {
      return <div key={`screen${i}`} className={i === 0 ? 'right-pane' : 'full-pane'} {...v(i === screenNo)}>
        {screen}
      </div>;
    };

    const renderButtons = () => {
      const createButton = <wired-button
        disabled={isVal(!this.state.provider.type || this.state.loading)}
        onClick={this.onCreate}>Create
      </wired-button>;
      const nextButton = <wired-button
        onClick={this.onNextScreen}>Next
      </wired-button>;
      const prevButton = <wired-button
        onClick={this.onPrevScreen}>Back
      </wired-button>;
      return <div className="button-pane">
        {screenNo === screens.length - 1 ? createButton : nextButton}
        {screenNo > 0 ? prevButton : null}
      </div>;
    };

    return <div className="new-dialog">
      <Loader loading={this.state.loading}/>
      <form>
        <div>
          {renderProviderSelector()}
          {screens.map(renderProviderScreen)}
        </div>
        {renderButtons()}
      </form>
    </div>
  }
}

DsNew.propTypes = {
  onDsCreated: PropTypes.func
}

export default DsNew;
