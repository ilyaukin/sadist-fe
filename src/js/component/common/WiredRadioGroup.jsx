import React, { useEffect, useRef } from 'react';
import '/packages/wired-radio-group';

const WiredRadioGroup = ({ onSelected, ...params }) => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && onSelected) {
      ref.current.addEventListener('selected', onSelected);
      return () => ref.current.removeEventListener('selected', onSelected);
    }
  });

  return <wired-radio-group ref={ref} {...params}/>;
}

export default WiredRadioGroup;
