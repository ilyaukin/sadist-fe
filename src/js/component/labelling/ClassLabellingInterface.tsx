import React from "react";
import { WiredRadio } from '/wired-elements/lib/wired-radio';
import LabellingInterface from "./LabellingInterface";

class ClassLabellingInterface extends LabellingInterface {
  private list: WiredRadio[] = [];

  componentWillUnmount() {
    this.list = [];
  }

  clearLabel() {
    this.list.forEach(element => {
      return element.checked = false;
    });
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
          {
            labels.map(label =>
              <wired-radio
                ref={(element: WiredRadio) => {
                  if (element) {
                    this.list.push(element);
                  }
                }}
                style={{ textAlign: 'left', width: '100px', marginLeft: 'calc(50% - 100px)', marginRight: '50%' }}
                key={label}
                name="label"
                value={label}
                onchange={(event) => this.onSelectLabel(label, event)}
              >{label}
              </wired-radio>
            )
          }
      </div>
    </div>;
  }

  /**
   * just to help to parse event; we can't inline this
   * in order not to duplicate listeners
   * @param label
   * @param event
   */
  onSelectLabel(label: string, event: CustomEvent) {
    if (event.detail.checked) {
      this.selectLabel(label);
    }
  }

}

export default ClassLabellingInterface;
