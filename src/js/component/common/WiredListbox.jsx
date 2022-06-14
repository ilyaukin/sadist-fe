import React, { useEffect, useRef } from 'react';
import '/packages/wired-listbox';

const WiredListbox = ({ onSelected, ...params }) => {
  const root = useRef();

  if (onSelected) {
    useEffect(() => {
      if (root.current) {
        root.current.addEventListener('selected', onSelected);
        return () => root.current.removeEventListener('selected', onSelected);
      }
    });
  }

  return <wired-listbox ref={root} {...params}/>
}

export default WiredListbox;
