import React, { ReactNode, useEffect, useState } from 'react';


interface DelayedRenderProps {
  children: ReactNode
}

/**
 workaround to https://github.com/wiredjs/wired-elements/issues/114
 */
const DelayedRender = ({ children }: DelayedRenderProps) => {
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    if (!readyToRender) {
      setTimeout(() => setReadyToRender(true), 1000);
    }
  });

  return <>{readyToRender ? children : null}</>;
}

export default DelayedRender;
