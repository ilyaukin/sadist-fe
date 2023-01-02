import React, { useEffect, useRef } from 'react';
import '/packages/wired-input';

const WiredInput = ({ value, onChange, focus, onFocus, ...props }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current && onChange) {
      let handler = (event) => onChange(ref.current.value, event);
      ref.current.addEventListener('change', handler);
      return () => ref.current.removeEventListener('change', handler);
    }
  });

  useEffect(() => {
    if (ref.current && onFocus) {
      let handler = (event) => onFocus(event);
      ref.current.addEventListener('focus', handler);
      return () => ref.current.removeEventListener('focus', handler);
    }
  });

  useEffect(() => {
    if (ref.current && focus) {
      ref.current.focus();
    }
  }, [focus]);

  return <wired-input ref={ref} value={value} {...props}/>;
}

export default WiredInput;
