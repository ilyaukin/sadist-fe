import React, { ReactNode } from 'react';
import { WiredCombo } from '/wired-elements/lib/wired-combo';
import LabellingInterface, {
  LabellingInterfaceProps,
  LabellingInterfaceState
} from './LabellingInterface';

interface SequenceItem {
  token: string;
  label: string;
}

interface SequenceItemExt extends SequenceItem {
  subsequence: SequenceItem[];
}

type SequenceExt = SequenceItemExt[];

interface SequenceLabellingInterfaceState extends LabellingInterfaceState {
  sequence?: SequenceExt;
  tokenI?: number;
  error?: string;
}

class SequenceLabellingInterface extends LabellingInterface<LabellingInterfaceProps, SequenceLabellingInterfaceState> {
  protected combo: WiredCombo | null = null;

  componentDidMount() {
    super.componentDidMount();
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  clearLabel() {
    // focus combobox - known issue, can't focus immediately
    setTimeout(() => this.combo?.focus(), 100);
  }

  valLabel(label: any): string {
    return JSON.stringify(label);
  }

  renderLabel(label: any): React.ReactNode {
    if (!( label instanceof Array )) {
      return <div className="error">Wrong label type!</div>;
    }

    return label.map(({ token, label }) => ( <>
      <span>{token}</span>
      <span style={{
        fontSize: 'small',
        verticalAlign: 'super',
        color: 'blue'
      }}>{label === 'whitespace' ? '' : `[${label}]`}</span>
    </> ));
  }

  /**
   * get label in the format which it is being sent to the server in
   */
  getLabel(): string {
    const { sequence } = this.state;
    return JSON.stringify(sequence?.map(item => ( {
      token: item.token,
      label: item.label
    } )));
  }

  getState(data: any): SequenceLabellingInterfaceState {
    let newState = super.getState(data);

    // initial sequence returned by the server
    const sequence: SequenceItem[] = data.sequence;
    if (sequence) {
      newState.sequence = sequence.map(item => ( {
        ...item,
        subsequence: [item],
      } ));
      newState.tokenI = 0;
    }
    newState.error = undefined;

    return newState;
  }

  renderQuiz(text: string | undefined, _label: any, labels: any[]): ReactNode {
    if (!text) {
      return '';
    }

    const { sequence, tokenI, error } = this.state;

    if (!sequence) {
      return <div className="error">Response has to
        contain <code>sequence</code> attribute.</div>;
    }

    return <>
      <div className="text">
        {/*text divided by tokens with the current token highlighted*/}
        {
          sequence.map((item, i) => (
              <>
              <span
                  className={tokenI === i ? "token-selected" : ""}>{item.token}</span>
              </>
          ))
        }
      </div>
      <div>
        <span className="field-error">{error}</span>
      </div>
      <div>
        {/*move to previous token*/}
        <wired-button title="," onClick={this.onPrevToken}>&lt;</wired-button>
        {/*move to next token*/}
        <wired-button title="." onClick={this.onNextToken}>&gt;</wired-button>
        {/*separate last token from the current one*/}
        <wired-button title="<"
                      onClick={this.onShrinkToken}>(&lt;)&lt;</wired-button>
        {/*join next token to the current one*/}
        <wired-button title=">" onClick={this.onExpandToken}>(&gt;&gt;)
        </wired-button>
        {/*label value combo-box*/}
        <wired-combo ref={(combo) => {
          this.combo = combo;
        }} style={{ top: '-7px' }} selected={sequence[tokenI!].label}
                     onselected={(event) => this.onSelectLabel(event.detail.selected, event)}>
          {labels.filter(label => label != 'whitespace').map(label => (
              <wired-item key={label} value={label}>{label}</wired-item>
          ))}
        </wired-combo>
        {/*submit sequence to the server*/}
        <wired-button style={{ color: 'blue' }} title="z"
                      onClick={this.onSubmit}>Submit
        </wired-button>
      </div>
    </>;
  }

  onPrevToken = () => {
    let { sequence, tokenI } = this.state;

    if (sequence == undefined || tokenI == undefined) {
      return;
    }

    // move to the previous token
    if (tokenI - 1 >= 0) {
      --tokenI;
    }

    // skip whitespaces
    while (tokenI - 1 >= 0 && sequence[tokenI].label == 'whitespace') {
      --tokenI;
    }

    this.setState({ tokenI });
  }

  onNextToken = () => {
    let { sequence, tokenI } = this.state;

    if (sequence == undefined || tokenI == undefined) {
      return;
    }

    // move to the next token
    if (tokenI + 1 < sequence.length) {
      ++tokenI;
    }

    // skip whitespaces
    while (tokenI + 1 < sequence.length && sequence[tokenI].label == 'whitespace') {
      ++tokenI;
    }

    this.setState({ tokenI });
  }

  onShrinkToken = () => {
    let { sequence, tokenI } = this.state;

    if (sequence == undefined || tokenI == undefined) {
      return;
    }

    if (sequence[tokenI].subsequence.length > 1) {
      let allButLast = sequence[tokenI].subsequence.slice(0, sequence[tokenI].subsequence.length - 1);
      let last = sequence[tokenI].subsequence[sequence[tokenI].subsequence.length - 1];
      sequence = sequence.slice(0, tokenI)
          .concat([{
            token: allButLast.map(item => item.token).join(''),
            label: sequence[tokenI].label,
            subsequence: allButLast,
          }, {
            ...last,
            subsequence: [last]
          }])
          .concat(sequence.slice(tokenI + 1));
    }

    this.setState({ sequence });
  }

  onExpandToken = () => {
    let { sequence, tokenI } = this.state;

    if (sequence == undefined || tokenI == undefined) {
      return;
    }

    if (tokenI + 1 < sequence.length) {
      sequence = sequence.slice(0, tokenI)
          .concat([{
            token: sequence[tokenI].token + sequence[tokenI + 1].token,
            label: sequence[tokenI].label,
            subsequence: sequence[tokenI].subsequence.concat(sequence[tokenI + 1].subsequence)
          }])
          .concat(sequence.slice(tokenI + 2));
    }

    this.setState({ sequence });
  }

  onSelectLabel(label: string, _event: CustomEvent) {
    let { sequence, tokenI } = this.state;

    if (sequence == undefined || tokenI == undefined) {
      return;
    }

    sequence = sequence.map((item, i) => tokenI === i ? {
      ...item,
      label
    } : item);

    this.setState({ sequence }, this.onNextToken);
  }

  onSubmit = () => {
    if (!this.validateSubmit()) {
      this.setState({ error: 'Please select labels for all tokens' });
      return;
    }

    this.selectLabel(this.getLabel());
  }

  private validateSubmit() {
    let { sequence, tokenI } = this.state;

    return sequence != undefined && tokenI != undefined && tokenI == sequence.length - 1;
  }

  onKeyUp(event: KeyboardEvent) {
    // hot keys to speed up process a little bit
    if (event.key == ',') {
      this.onPrevToken();
    } else if (event.key == '.') {
      this.onNextToken();
    } else if (event.key == '<') {
      this.onShrinkToken();
    } else if (event.key == '>') {
      this.onExpandToken();
    } else if (event.key == 'z' && this.validateSubmit()) {
      this.onSubmit();
    }
  }

}

export default SequenceLabellingInterface;
