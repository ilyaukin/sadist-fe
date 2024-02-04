import React, { useState } from 'react';
import '../../css/index.scss';
import './common/CustomElement';
import Uniselector from './common/Uniselector';
import { renderPage } from '../helper/react-helper';

const ComponentDemo = () => {

  const demo: { [key in keyof JSX.IntrinsicElements]?: JSX.Element } = {
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
    'wired-combo': function () {

      React.useEffect(() => {
        setTimeout(() =>
                document.getElementById("combo")?.focus(),
            100);
      });

      return <>
        <wired-combo id='combo' selected="banana">
          <wired-item value="banana">Banana</wired-item>
          <wired-item value="apple">Apple</wired-item>
          <wired-item value=''>Some fruit with a long name a</wired-item>
        </wired-combo>
      </>
    }(),
    'wired-histogram': function () {

      const [selected, setSelected] = React.useState<string | null>(null);
      const isSelected = (str: string): boolean => selected === str;

      return <>
        <div style={{ width: '300px', display: 'inline-block' }}>
          <p>Single-parameter histogram</p>
          <br/>
          <wired-histogram>
            <wired-bar
                data-id="Apple"
                data-name="count"
                data-value={300}
                selected={isSelected('A')}
                onClick={() => setSelected('A')}
            />
            <wired-bar
                data-id="Banana"
                data-name="count"
                data-value={1000}
                selected={isSelected('B')}
                onClick={() => setSelected('B')}
            />
            <wired-bar
                data-id="Cherry"
                data-name="count"
                data-value={200}
                selected={isSelected('C')}
                onClick={() => setSelected('C')}
            />
          </wired-histogram>
        </div>
        <div style={{ width: '300px', display: 'inline-block' }}>
          <p>Multi-parameter histogram</p>
          <br/>
          <wired-histogram>
            <wired-bar
                data-id="Apple"
                data-name="on counter"
                data-value={300}
            />
            <wired-bar
                data-id="Apple"
                data-name="sold out"
                data-value={120}
            />
            <wired-bar
                data-id="Apple"
                data-name="stolen"
                data-value={290}
            />
            <wired-bar
                data-id="Banana"
                data-name="on counter"
                data-value={499}
            />
            <wired-bar
                data-id="Banana"
                data-name="sold out"
                data-value={300}
            />
            <wired-bar
                data-id="Banana"
                data-name="stolen"
                data-value={202}
            />
            <wired-bar
                data-id="Cherry"
                data-name="on counter"
                data-value={100}
            />
            <wired-bar
                data-id="Cherry"
                data-name="sold out"
                data-value={100}
            />
            <wired-bar
                data-id="Cherry"
                data-name="stolen"
                data-value={0}
            />
          </wired-histogram>
        </div>
        <div style={{ width: '300px', display: 'inline-block' }}>
          <p>Histogram with negative values</p>
          <br/>
          <wired-histogram>
            <wired-bar
                data-id="Mexico city"
                data-name="elevation"
                data-value={2537}
            />
            <wired-bar
                data-id="Gulf of Mexico"
                data-name="elevation"
                data-value={-1585}
            />
            <wired-bar
                data-id="Indian Ocean"
                data-name="elevation"
                data-value={-10911}
            />
          </wired-histogram>
        </div>
      </>
    }(),
    'wired-globe': function () {
      return <>
        <wired-globe
            style={{ width: '600px' }}
        >
          <wired-marker
            data-id={{ id: 1, name: 'Moscow', coordinates: [ 37.61556, 55.75222 ]}}
            data-name="count"
            data-value={2}
            data-label='Moscow'
          />
          <wired-marker
            data-id={{ id: 2, name: 'Paris', coordinates: [ 2.3488, 48.85341 ]}}
            data-name="count"
            data-value={1}
            data-label='Paris'
          />
          <wired-marker
            data-id={{ id: 3, name: 'New York', coordinates: [ -74.00597, 40.71427 ]}}
            data-name="count"
            data-value={1}
            data-label='New York'
          />
        </wired-globe>
      </>
    }(),
  }

  const [demoKey, setDemoKey] = useState<keyof JSX.IntrinsicElements | undefined>('wired-globe');

  return <>
    {Object.keys(demo).map(
        (key) => <Uniselector
            key={key}
            selected={demoKey == key}
            onClick={() => setDemoKey(key as keyof JSX.IntrinsicElements)}
        >{key}</Uniselector>
    )}
    <br/>
    <br/>
    {demoKey ? demo[demoKey] : 'Select component'}
  </>
}

renderPage(<ComponentDemo/>);

export default ComponentDemo;
