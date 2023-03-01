import React, { useState } from 'react';
import '../../css/index.scss';
import './common/CustomElement';
import Uniselector from './common/Uniselector';
import { renderPage } from '../helper/react-helper';

const ComponentDemo = () => {
  type ComponentType =
    'wired-button' |
    'wired-card' |
    'wired-checkbox' |
    'wired-combo' |
    'wired-combo-lazy' |
    'wired-dialog' |
    'wired-divider' |
    'wired-input' |
    'wired-listbox' |
    'wired-radio' |
    'wired-radio-group' |
    'wired-spinner';

  const demo: { [key in ComponentType]?: JSX.Element } = {
    'wired-combo-lazy': function () {
      function getValues() {
        let s = new Date();
        let values = [...Array(50000).keys()].map((i) => ( { value: `${i}`, text: `Item ${i}` } ))
        // @ts-ignore
        let t = new Date() - s;
        console.log(t);
        return values;
      }

      React.useEffect(() => {
        setTimeout(() =>
            document.getElementById("combo")?.focus(),
          100);
      });

      return <>
        <wired-combo-lazy
          id='combo'
          values={getValues()}
          onselected={e => console.log(e.detail)}
        >
        </wired-combo-lazy>
      </>
    }(),
    'wired-combo':
      <>
        <wired-combo>
          <wired-item value="banana">Banana</wired-item>
          <wired-item value="apple">Apple</wired-item>
          <wired-item value=''>Some fruit with a long name a</wired-item>
        </wired-combo>
      </>,
  }

  const [demoKey, setDemoKey] = useState<ComponentType | undefined>();

  return <>
    {Object.keys(demo).map(
      (key: string) => <Uniselector
        selected={demoKey == key}
        text={key}
        onClick={() => setDemoKey(key as ComponentType)}
      />
    )}
    <br/>
    <br/>
    {demoKey ? demo[demoKey] : 'Select component'}
  </>
}

renderPage(<ComponentDemo/>);

export default ComponentDemo;
