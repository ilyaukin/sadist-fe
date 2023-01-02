import React, { useEffect, useRef } from 'react';
import '/packages/wired-listbox';

const WiredListbox = ({ onSelected, ...params }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && onSelected) {
      ref.current.addEventListener('selected', onSelected);
      return () => ref.current.removeEventListener('selected', onSelected);
    }
  }, [onSelected]);

  return <wired-listbox ref={ref} {...params}/>
}

export default WiredListbox;
