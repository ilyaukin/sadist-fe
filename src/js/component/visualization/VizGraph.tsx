import React, { ReactNode } from 'react';
import { VizData, VizMeta } from '../../model/ds';

interface VizGraphProps {
  meta: VizMeta;
  data: VizData;
  id: any;
  name?: string;
  label?: string;
}

const VizGraph = (props: VizGraphProps) => {

  let { meta, data, id, name, label } = props;
  name ||= meta.key;

  function error(message: string) {
    return <div className="error">
      <p>Error: <strong>{message}</strong> occured while rendering graph:</p>
      <pre>{JSON.stringify(meta)}</pre>
    </div>
  }

  function renderChildren(): ReactNode {
    if (!( data instanceof Array )) {
      return error(`Data for "${meta.type}" is expected to be an array`);
    }

    if (!meta.children) {
      return null;
    }

    return data.map((item, i) => {
      return Object.entries(meta.children!).map(([k, v]) => {
        return <>
          <VizGraph
              key={`${i}-${k}`}
              meta={v}
              data={item[k]}
              id={item.id}
              name={k}
              label={meta.getLabel?.(item)}
          />
        </>
      });
    });
  }

  switch (meta.type) {
    case 'marker':
      if (typeof data !== 'number') {
        return error('Data for "marker" must be a number');
      }

      return <>
        <wired-marker
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
        />
      </>;

    case 'bar':
      if (typeof data !== 'number') {
        return error('Data for "bar" must be a number');
      }

      return <>
        <wired-bar
            data-id={id}
            data-name={name}
            data-value={data}
            data-label={label}
        />
      </>;

    case 'histogram':
      return <>
        <wired-histogram>
          {renderChildren()}
        </wired-histogram>
      </>;

    case 'globe':
      return <>
        <wired-globe>
          {renderChildren()}
        </wired-globe>
      </>;

    default:
      return error(`Rendering of ${meta.type} not implemented`);
  }

}

export default VizGraph;
