import React, { Component } from "react";
import ErrorDialog from "../common/ErrorDialog";
import Loader from "../common/Loader";
import PropTypes from "prop-types";

/**
 * Base class for different kind of labelling.
 * I know that react don't recommend more than one level inheritance,
 * but in this case page's structure, rendering and API calls
 * are particularly the same, differs only by label type and
 * how it's being chosen, so the OOP model suites better than
 * composition or higher order components.
 */
class LabellingInterface extends Component {

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

  componentDidMount() {
    this.setState({ loading: true }, () => {
      const { prefix, sessionId } = this.props;

      fetch(`${prefix}/session/${sessionId}`).then((response) => {
        return this.nextQuiz(response);
      }).catch((e) => {
        ErrorDialog.raise('Fetching data error: ' + e.toString());
        this.setState({ loading: false });
      })
    });
  }

  componentDidUpdate() {
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
   * clear selected label for the next quiz, override this.
   */
  clearLabel() {
  }

  /**
   * handler of the event when a user selects label
   * @param value selected label
   */
  selectLabel = (value) => {
    this.setState({ label: value, loading: true }, () => {
      const { prefix, sessionId } = this.props;

      const data = new FormData();
      data.set('text', this.state.text);
      data.set('label', value);

      fetch(`${prefix}/session/${sessionId}`, {
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

  /**
   * value of label which is passed to the server
   * @param label
   * @returns {*}
   */
  valLabel(label) {
    return label;
  }

  /**
   * label which is displayed on thr page
   * @param label
   * @returns {*}
   */
  renderLabel(label) {
    return label;
  }

  nextQuiz(response) {
    response.json().then((data) => {
      if (data.success) {
        if (data.text) {
          this.setState({ text: data.text, label: undefined, loading: false }, () => {
            this.clearLabel();
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
    const { prefix, sessionId } = this.props;

    this.setState({ loading: true }, () => {
      fetch(`${prefix}/session/${sessionId}/merge`, {
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
    const { prefix, sessionId } = this.props;

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
      fetch(`${prefix}/session/${sessionId}/resolve-conflicts`, {
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
    return 'implement me!'
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
                          ref={checkbox => this.refDiffCheckbox(text, this.valLabel(label), checkbox)}>{this.renderLabel(label)}</wired-checkbox>
                        session = '';
                        break;
                      case 'session':
                        // label is from session; show the checkbox in session's column
                        master = '';
                        session = <wired-checkbox
                          ref={checkbox => this.refDiffCheckbox(text, this.valLabel(label), checkbox)}>{this.renderLabel(label)}</wired-checkbox>;
                        break;
                      case 'both':
                        // label is from both master and session; show the checkbox in session column's checked
                        // by default, and in master column the disabled checkbox with the same state
                        master =
                          <wired-checkbox ref={checkbox => this.refShadowCheckbox(text, this.valLabel(label), checkbox)}
                                          checked
                                          disabled>{this.renderLabel(label)}</wired-checkbox>;
                        session =
                          <wired-checkbox ref={checkbox => this.refDiffCheckbox(text, this.valLabel(label), checkbox)}
                                          checked>{this.renderLabel(label)}</wired-checkbox>;
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

LabellingInterface.propTypes = {
  type: PropTypes.string,
  prefix: PropTypes.string,
  sessionId: PropTypes.string,
  labels: PropTypes.array
}

LabellingInterface.defaultProps = window.data || {};
export default LabellingInterface;