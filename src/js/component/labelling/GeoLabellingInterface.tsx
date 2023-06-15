import React from "react";
import '/packages/wired-combo-lazy';
import { WiredComboLazy } from '/packages/wired-combo-lazy';
import LabellingInterface, { LabellingInterfaceProps, LabellingInterfaceState } from "./LabellingInterface";

class GeoLabellingInterface extends LabellingInterface {
  private combo: WiredComboLazy | null | undefined;
  private d1: HTMLDivElement | null | undefined;
  private d2: HTMLDivElement | null | undefined;

  componentDidMount() {
    super.componentDidMount();
  }

  componentDidUpdate(prevProps: Readonly<LabellingInterfaceProps>, prevState: Readonly<LabellingInterfaceState>, snapshot: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);

    if (this.combo) {
      this.combo.values = this.props.labels;
      setTimeout(() => {
        this.combo!.focus();
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
    this.combo!.selected = undefined;
  }

  valLabel(label: any) {
    return label.value;
  }

  renderLabel(label: any) {
    return label.text;
  }

  onSelectLabel = (event: CustomEvent) => {
    this.selectLabel(event.detail.selected);
  }

  renderQuiz(text: string | undefined, _label: any | undefined, _labels: any[]) {
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
          <wired-combo-lazy id='combo' ref={(combo) => this.combo = combo} onselected={this.onSelectLabel}>
          </wired-combo-lazy>
        </div>
      </div>
    </div>;
  }
}

export default GeoLabellingInterface;
