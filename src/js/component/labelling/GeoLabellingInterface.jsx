import React from "react";
import '/packages/wired-combo-lazy';
import LabellingInterface from "./LabellingInterface";

class GeoLabellingInterface extends LabellingInterface {

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate() {
    super.componentDidUpdate();

    if (this.combo) {
      this.combo.values = this.props.labels;
      this.combo.addEventListener('selected', this.onSelectLabel);
      setTimeout(() => {
        this.combo.focus();
      }, 100);
    }

    // this hack is to emulate {overflow: auto} but not
    // to crop drop-down when it's open
    if (this.d1 && this.d2) {
      this.d1.style.height = `${this.d2.offsetHeight +
      parseInt(getComputedStyle(this.d2).marginTop) +
      parseInt(getComputedStyle(this.d2).marginBottom)}px`;
    }
  }

  clearLabel() {
    this.combo.selected = undefined;
  }

  valLabel(label) {
    return label.value;
  }

  renderLabel(label) {
    return label.text;
  }

  renderQuiz(text, label, labels) {
    if (!text) {
      return '';
    }

    return <div style={{ overflow: 'visible' }} ref={(d1) => this.d1 = d1}>
      <div style={{ margin: '5%', float: 'left', width: '40%' }} ref={(d2) => this.d2 = d2}>
        <div className="text">
          <span>{text}</span>
        </div>
      </div>
      <div style={{ margin: '5%', float: 'right', width: '40%', textAlign: "left" }}>
        <div>
          <wired-combo-lazy id='combo' ref={(combo) => this.combo = combo}>
          </wired-combo-lazy>
        </div>
      </div>
    </div>;
  }

  onSelectLabel = (event) => {
    this.selectLabel(event.detail.selected);
  }
}

export default GeoLabellingInterface;
