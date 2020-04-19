import React, { Component } from "react";
import PropTypes from 'prop-types';
import { WiredRadioGroup } from 'wired-radio-group';
import { WiredRadio } from 'wired-radio';
import { WiredButton } from 'wired-button';
import { WiredCheckbox } from 'wired-checkbox';
import './index.css';
import './labelling.css';
import { renderPage } from "../helper/react-helper";
import ErrorDialog from "./common/ErrorDialog";
import Loader from "./common/Loader";

class LabellingPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      loading: false,
      label: undefined
    };
    ErrorDialog.raise = (err) => this.setState({ err });
    ErrorDialog.close = () => this.setState({ err: undefined });
  }

  nextQuiz(response) {
    response.json().then((data) => {
      if (data.success) {
        if (data.text) {
          this.setState({ text: data.text, label: undefined, loading: false }, () => {
            this.list.selected = null;
          });
        } else {
          // all labeled, ask to merge
          const { status, conflicts } = data;
          this.setState({ text: undefined, status, conflicts, loading: false });
        }
      } else {
        ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'));
        this.setState({ loading: false });
      }
    }).catch((e) => {
      ErrorDialog.raise('Parsing json error: ' + e.toString());
      this.setState({ loading: false });
    })
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      const { sessionId } = this.props;

      fetch(`/dl/session/${sessionId}`).then((response) => {
        return this.nextQuiz(response);
      }).catch((e) => {
        ErrorDialog.raise('Fetching data error: ' + e.toString());
        this.setState({ loading: false });
      })
    });
  }

  componentDidUpdate() {
    if (this.list) {
      this.list.addEventListener('selected', this.onSelectLabelByEvent);
    }

    if (this.diffCheckboxes) {
      Object.entries(this.diffCheckboxes).forEach(kv => {
        Object.entries(kv[1]).forEach(kv1 => {
          if (kv1[1]) {
            kv1[1].addEventListener('change', this.onDiffCheckboxChange);
          }
        })
      })
    }
  }

  /**
   * just to help to parse event; we can't inline this
   * in order not to duplicate listeners
   * @param event
   */
  onSelectLabelByEvent = (event) => this.onSelectLabel(event, event.detail?.selected);

  onSelectLabel = (event, value) => {
    this.setState({ label: value, loading: true }, () => {
      const { sessionId } = this.props;

      const data = new FormData();
      data.set('text', this.state.text);
      data.set('label', value);

      fetch(`/dl/session/${sessionId}`, {
        method: 'POST',
        body: data
      }).then((response) => {
        this.nextQuiz(response);
      }).catch((e) => {
        ErrorDialog.raise('Error submitting data: ' + e.toString());
        this.setState({ loading: false });
      })
    });
  }

  onDiffCheckboxChange = (event) => {
    let shadowBro;
    if (this.diffCheckboxes && this.shadowCheckboxes) {
      Object.entries(this.diffCheckboxes).forEach(kv => {
        Object.entries(kv[1]).forEach(kv1 => {
          if (kv1[1] == event.target) {
            shadowBro = this.shadowCheckboxes?.[kv[0]]?.[kv1[0]];
          }
        })
      })
    }
    if (shadowBro) {
      shadowBro.checked = event.target.checked;
    }
  }

  onMerge = () => {
    const { sessionId } = this.props;

    this.setState({ loading: true }, () => {
      fetch(`/dl/session/${sessionId}/merge`, {
        method: 'POST'
      }).then((response) => {
        response.json().then((data) => {
          if (data.success) {
            const { status, conflicts } = data;
            this.setState({ status, conflicts, loading: false });
          } else {
            ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'));
            this.setState({ loading: false });
          }
        }).catch((e) => {
          ErrorDialog.raise('Error parsing json: ' + e.toString());
          this.setState({ loading: false });
        })
      }).catch((e) => {
        ErrorDialog.raise('Error submitting data: ' + e.toString());
        this.setState({ loading: false });
      })
    })
  }

  onResolve = () => {
    const { sessionId } = this.props;

    const data = new FormData();
    const samples = [];
    Object.entries(this.diffCheckboxes).forEach((kv) => {
        const labels = [];
        Object.entries(kv[1]).forEach((kv1) => {
          if (kv1[1].checked) {
            labels.push(kv1[0]);
          }
        });
        samples.push({ text: kv[0], labels });
      }
    );
    data.set('samples', JSON.stringify(samples));

    this.setState({ loading: true }, () => {
      fetch(`/dl/session/${sessionId}/resolve-conflicts`, {
        method: 'POST',
        body: data
      }).then((response) => {
        response.json().then((data) => {
          if (data.success) {
            const { status, conflicts } = data;
            this.setState({ status, conflicts, loading: false });
          } else {
            ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'));
            this.setState({ loading: false });
          }
        }).catch((e) => {
          ErrorDialog.raise('Error parsing json: ' + e.toString());
          this.setState({ loading: false });
        })
      }).catch((e) => {
        ErrorDialog.raise('Error submitting data: ' + e.toString());
        this.setState({ loading: false });
      })
    })
  }

  refDiffCheckbox = (text, label, checkbox) => {
    if (!this.diffCheckboxes) {
      this.diffCheckboxes = {};
    }
    if (!this.diffCheckboxes[text]) {
      this.diffCheckboxes[text] = {};
    }
    this.diffCheckboxes[text][label] = checkbox;
  }

  refShadowCheckbox = (text, label, checkbox) => {
    if (!this.shadowCheckboxes) {
      this.shadowCheckboxes = {}
    }
    if (!this.shadowCheckboxes[text]) {
      this.shadowCheckboxes[text] = {};
    }
    this.shadowCheckboxes[text][label] = checkbox;
  }

  renderQuiz(text, label, labels) {
    if (!text) {
      return '';
    }

    return <div>
      <div className="text">
        {text}
      </div>

      <div className="labels">
        <wired-radio-group ref={list => this.list = list}>
          {
            labels.map(label =>
              <wired-radio
                style={{ textAlign: 'left', width: '100px', marginLeft: 'calc(50% - 100px)' }}
                key={label}
                name={label}
              >{label}
              </wired-radio>
            )
          }
        </wired-radio-group>
      </div>
    </div>;
  }

  renderStatus() {
    const { status, conflicts } = this.state;
    const elements = [];

    switch (status) {
      case 'merged':
        elements.push(<p>Data has been merged to master.</p>);
        break;
      case 'finished':
        elements.push(<p>Congratulations! All data labeled.</p>);

        // render merge button
        elements.push(<wired-button onClick={this.onMerge}>Merge to Master</wired-button>)
        break;
      case 'merging':
        elements.push(<p>Please resolve the following conflicts.</p>);

        // render conflicts
        if (conflicts && conflicts.length) {
          elements.push(
            <div>
              <table>
                <thead>
                <tr>
                  <th>Text</th>
                  <th>Master</th>
                  <th>Session</th>
                </tr>
                </thead>
                <tbody>
                {conflicts.map(conflict => {
                  const { text, diff } = conflict;

                  const renderDiffRow = (diffRow) => {
                    const { label, source } = diffRow;
                    let master;
                    let session;
                    switch (source) {
                      case 'master':
                        // label is from master; show the checkbox in master's column
                        master = <wired-checkbox
                          ref={checkbox => this.refDiffCheckbox(text, label, checkbox)}>{label}</wired-checkbox>
                        session = '';
                        break;
                      case 'session':
                        // label is from session; show the checkbox in session's column
                        master = '';
                        session = <wired-checkbox
                          ref={checkbox => this.refDiffCheckbox(text, label, checkbox)}>{label}</wired-checkbox>;
                        break;
                      case 'both':
                        // label is from both master and session; show the checkbox in session column's checked
                        // by default, and in master column the disabled checkbox with the same state
                        master = <wired-checkbox ref={checkbox => this.refShadowCheckbox(text, label, checkbox)} checked
                                                 disabled>{label}</wired-checkbox>;
                        session = <wired-checkbox ref={checkbox => this.refDiffCheckbox(text, label, checkbox)}
                                                  checked>{label}</wired-checkbox>;
                        break;
                    }
                    return [
                      <td>{master}</td>,
                      <td>{session}</td>
                    ];
                  };

                  // <br/> to visually separate samples.
                  // todo: make proper css solution
                  return [
                    <tr>
                      <td><br/>{text}</td>
                      {renderDiffRow(diff[0])}
                    </tr>
                  ].concat(
                    diff.slice(1).map(diffRow => {
                      return <tr>
                        {[<td/>, ...renderDiffRow(diffRow)]}
                      </tr>
                    })
                  );
                })}
                </tbody>
              </table>
            </div>
          )
        }

        // render 'Resolve' button
        elements.push(<wired-button onClick={this.onResolve}>Resolve</wired-button>);
        break;

      default:
        return '';
    }

    return elements;
  }

  render() {
    const { sessionId, labels } = this.props;
    const { text, label, loading, err } = this.state;
    return <div className="content" style={{ textAlign: 'center' }}>
      <ErrorDialog err={err}/>
      <h1>Labelling [session {sessionId}]</h1>

      <Loader loading={loading}/>
      {this.renderQuiz(text, label, labels)}
      {this.renderStatus()}
    </div>
  }
}

LabellingPage.props = {
  sessionId: PropTypes.string,
  labels: PropTypes.array
}

LabellingPage.defaultProps = window.data || {};

export default LabellingPage;

renderPage(<LabellingPage/>);
