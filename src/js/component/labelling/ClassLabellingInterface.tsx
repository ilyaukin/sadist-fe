import React from "react";
import LabellingInterface from "./LabellingInterface";

class ClassLabellingInterface extends LabellingInterface {
  private list: { selected?: string; } | null | undefined;

  clearLabel() {
    this.list!.selected = undefined;
  }

  renderQuiz(text: string | undefined, _label: string | undefined, labels: string[]) {
    if (!text) {
      return '';
    }

    return <div>
      <div className="text">
        {text}
      </div>

      <div className="labels">
        <wired-radio-group ref={list => this.list = list} onselected={this.onSelectLabel}>
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

  /**
   * just to help to parse event; we can't inline this
   * in order not to duplicate listeners
   * @param event
   */
  onSelectLabel = (event: CustomEvent) => this.selectLabel(event.detail?.selected);

}

export default ClassLabellingInterface;
