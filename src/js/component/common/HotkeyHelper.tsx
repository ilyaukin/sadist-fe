import React, { useState } from 'react';
import { getHotkeys, useHotkeys } from '../../hook/hotkey-hook';

const HotkeyHelper = () => {
  const [isVisible, setVisible] = useState(false);

  // window.addEventListener('keyup', (e) => console.log(e))
  useHotkeys(null, [{
    key: 'Alt',
    event: 'keydown',
    title: "Show this message",
    callback: () => {
      setVisible(true);
    },
  }, {
    key: 'Alt',
    event: 'keyup',
    callback: () => {
      setVisible(false);
    },
  }]);

  const renderHelpMessage = () => {
    return <table>
      {getHotkeys().filter(({ title }) => title)
          .map(({ key, title }) => <tr>
        <td><strong>{key}</strong></td>
        <td>{title}</td>
      </tr>)}
    </table>;
  }

  return isVisible ? <div className="hotkey-helper">{renderHelpMessage()}</div> : null;
}

export default HotkeyHelper;
