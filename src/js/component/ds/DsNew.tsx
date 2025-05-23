import React, { Component } from 'react';
import AbstractProvider from "../provider/AbstractProvider";
import ValidationError from "../provider/ValidationError";
import NullProvider from "../provider/NullProvider";
import LocalFileProvider from '../provider/LocalFileProvider';
import GoogleSheetProvider from '../provider/GoogleSheetProvider';
import WebCrawlerProvider from '../provider/WebCrawlerProvider';
import ErrorDialog from "../common/ErrorDialog";
import Loader from "../common/Loader";
import Block from '../common/Block';
import DelayedRender from '../common/DelayedRender';
import { isVal } from "../../helper/wired-helper";
import { createDs } from '../../helper/data-helper';
import { DsMeta } from '../../model/ds';

interface DsNewProps {
  onDsCreated: (meta: DsMeta) => any;
}

interface DsNewState {
  loading: boolean;
  provider: AbstractProvider;
  screenNo: number;
}

class DsNew extends Component<DsNewProps, DsNewState> {
  _nullProvider = new NullProvider({});
  providers!: AbstractProvider[];

  constructor(props: DsNewProps) {
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
      new LocalFileProvider(providerProps),
      new GoogleSheetProvider(providerProps),
      new WebCrawlerProvider(providerProps),
    ];
  }

  onProviderSelected(value: string, _event: CustomEvent) {
    this.setState({
      provider:
          this.providers.find((p) => p.type === value) || this._nullProvider
    });
  }

  onNextScreen = () => {
    const { screenNo } = this.state;
    this.state.provider.validate(screenNo)
        .then(() => this.setState({ screenNo: screenNo + 1 }))
        .catch(() => {/* ignore. provider will display errors itself */
        });
  }

  onPrevScreen = () => {
    const { screenNo } = this.state;
    this.setState({ screenNo: screenNo - 1 });
  }

  onUpdateScreens = () => {
    // since provider can change its screens
    // count and disposition depending on previously filled values,
    // we should re-render the component if it happens,
    // state will be the same, just provider will return different screens.
    // AND that is why we can't make DsNew a functional component.
    this.forceUpdate();
  }

  onCreate = () => {
    this.setState({ loading: true }, () => {
      this.state.provider.loadCSV().then((result) => {
        createDs(result)
            .then((item) => this.props.onDsCreated(item))
            .catch((e) => {
              ErrorDialog.raise(e.toString());
            })
            .finally(() => {
              this.setState({ loading: false });
            });
      }).catch((e: any) => {
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
      <label htmlFor="source-type">Source Type:<br/></label>
      <wired-combo
          id="source-type"
          style={{ width: '100%' }}
          onselected={(event) => this.onProviderSelected(event.detail.selected, event)}
      >
        {
          this.providers.map((provider) =>
              <wired-item value={provider.type} key={provider.type}>
                <img className="item" src={provider.icon}
                     alt={provider.type}/>{provider.text}
              </wired-item>
          )
        }
      </wired-combo>
    </DelayedRender>
  }

  visibilityStyle = (b: boolean) => b ? {} : { display: 'none' };

  renderProviderSelector = (screenNo: number) => {
    return <Block
        key="selector"
        size="50%"
        style={{ ...this.visibilityStyle(screenNo === 0), overflow: 'visible' }}
    >
      {this.renderTypeCombo()}
      <br/>
      {this.state.provider.renderDescription()}
    </Block>;
  };

  renderProviderScreen = (screen: JSX.Element, i: number) => {
    const { screenNo } = this.state;
    return <Block
        key={`screen${i}`}
        className="block new-dialog-screen-limit"
        style={{ ...this.visibilityStyle(screenNo === i), overflowY: 'visible', overflowX: 'hidden' }}
    >
      {screen}
    </Block>;
  };

  renderButtons = (screenNo: number, screenCount: number) => {
    const createButton = <wired-button
        className="nav-button"
        disabled={isVal(!this.state.provider.type || this.state.loading)}
        onClick={this.onCreate}>Create
    </wired-button>;
    const nextButton = <wired-button
        className="nav-button"
        onClick={this.onNextScreen}>Next
    </wired-button>;
    const prevButton = <wired-button
        className="nav-button"
        onClick={this.onPrevScreen}>Back
    </wired-button>;
    return <Block>
      {screenNo === screenCount - 1 ? createButton : nextButton}
      {screenNo > 0 ? prevButton : null}
    </Block>;
  };

  render() {
    const screens = this.state.provider.renderScreens();
    const { screenNo } = this.state;

    return <>
      <Loader loading={this.state.loading}/>
      <form>
        <div className="block-container-vertical"
             style={{ overflow: 'visible' }}>
          <Block className="block block-container-horizontal"
                 style={{ overflow: 'visible' }}>
            {this.renderProviderSelector(screenNo)}
            {screens.map(this.renderProviderScreen)}
          </Block>
          {this.renderButtons(screenNo, screens.length)}
        </div>
      </form>
    </>
  }
}

export default DsNew;
