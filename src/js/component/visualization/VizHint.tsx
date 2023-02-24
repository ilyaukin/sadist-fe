import React from 'react';
import moment from 'moment/moment';
import CountDown from './CountDown';
import { DsInfo } from '../../model/ds';

interface VizHintProps {
  dsInfo: DsInfo;
}

const VizHint: React.FC<VizHintProps> = ({ dsInfo }: VizHintProps) => {
  // check error
  if (dsInfo.err) {
    return <p>Failed to get status ({dsInfo.err}). Please
      refresh the page. </p>;
  }

  // display status of classification
  let { classification, detailization } = dsInfo.meta;
  classification = classification || {};
  detailization = detailization || {};
  let hint = [];
  if (classification.status !== 'finished') {
    const p1 = <p>Please wait while data classification
      is done. </p>;
    if (classification.status) {
      const p2text = `Status: ${classification.status}`;
      if (classification.started && classification.estimated) {
        let finished_estimation = moment(classification.started)
          .add(classification.estimated, 'millisecond')
        const countDown = CountDown({ to: finished_estimation });
        hint.push(<countDown.Render
          before={
            <>
              {p1}
              <p>{p2text} (<countDown.Clock/> left)</p>
            </>
          }
          after={<p>Seems classification needs too much
            time or it's hung, please contact &nbsp;
            <a
              href="mailto:kzerby@gmail.com"
              target="_blank"> developer
            </a>
          </p>}
        />);
      } else {
        hint.push(p1);
        hint.push(<p>{p2text}</p>);
      }
    } else {
      hint.push(p1);
    }

    return <>{hint}</>;
  }

  // display status of columns detailization
  let detailizationByCol = Object.entries(detailization);
  if (!detailizationByCol.length) {
    return <p>Unfortunately, no columns are recognized as known
      data type. </p>;
  }

  if (detailizationByCol.find((kv) => kv[1].status === 'finished')) {
    hint.push(
      <p>Please use dropdowns near the table columns, to
        visualize data. </p>
    );
  } else {
    hint.push(
      <p>Please wait while columns analysis is done. </p>
    );
  }
  hint.push(
    <p>Status:</p>
  );
  hint.push(
    <ul>{detailizationByCol.map((kv) => <li key={kv[0]}> {kv[0]}: {kv[1].status}</li>)}</ul>
  );
  return <>{hint}</>;
}

export default VizHint;
