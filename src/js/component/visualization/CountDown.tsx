import React, { useEffect, useState } from 'react';
import moment from "moment";

interface CountDownProps {
  to: moment.Moment;
}

interface CountDownRenderProps {
  before: React.ReactNode;
  after: React.ReactNode;
}

/**
 * Helper component to display countdown clock
 */
const CountDown = (props: CountDownProps): {
  Render: React.FC<CountDownRenderProps>;
  Clock: React.FC<{}>;
} => {
  const diff0 = props.to.diff(moment())

  const ctx = React.createContext({ diff: diff0 });

  return {
    Render: (renderProps: CountDownRenderProps) => {
      const [diff, setDiff] = useState(diff0);

      useEffect(() => {
          setTimeout(tick, 1000);
        }, []
      );

      const tick = () => {
        const diff = props.to.diff(moment());

        if (diff < 0) {
          return;
        }

        setDiff(diff);
        setTimeout(tick, 1000);
      }

      return <ctx.Provider value={{ diff: diff }}>
        {diff < 0 ? renderProps.after : renderProps.before}
      </ctx.Provider>
    },

    Clock: () => {

      const leadSpace = (x: number): string => {
        if (x < 10) {
          return `0${x}`;
        }
        return `${x}`;
      }

      const { diff } = React.useContext(ctx);
      let t = Math.floor(diff / 1000);
      let s = t % 60, m = 0, h;
      t = Math.floor(t / 60);
      if (t > 0) {
        m = t % 60;
        h = Math.floor(t / 60);
      }

      const delimiter = <span className="clock-delimiter">:</span>;

      return <span className="clock">
        {h ? [h, delimiter, leadSpace(m)] : [m]}
        {[delimiter, leadSpace(s)]}
        </span>;
    }
  }
}

export default CountDown;
