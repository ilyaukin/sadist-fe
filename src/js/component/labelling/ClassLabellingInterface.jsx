import React from "react";
import LabellingInterface from "./LabellingInterface";

class ClassLabellingInterface extends LabellingInterface {

  componentDidUpdate() {
    super.componentDidUpdate();

    if (this.list) {
      this.list.addEventListener('selected', this.onSelectLabel);
    }
  }

  clearLabel() {
    this.list.selected = null;
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

  /**
   * just to help to parse event; we can't inline this
   * in order not to duplicate listeners
   * @param event
   */
  onSelectLabel = (event) => this.selectLabel(event.detail?.selected);

}

export default ClassLabellingInterface;
