import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

const Dropdown = ({ className, toggle, content }, ref) => {
  const dropdown = useRef();
  const pane = useRef();
  const root = useRef();

  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    expand: () => setOpen(true),
    collapse: () => setOpen(false),
  }));

  useEffect(() => {
    if (open) {
      const listener = (event) => {
        if (!dropdown.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener('click', listener);
      return () => document.removeEventListener('click', listener);
    }
  }, [open]);

  useEffect(() => {
    // relocate filter pane if it happened behind the left boundary of content
    if (root.current && pane.current) {
      const containerElement = root.current.parentElement;
      const left = containerElement.offsetLeft + root.current.offsetLeft;

      if (left < 0) {
        pane.current.style.left = `${-left}px`;
      }
    }
  }, [root.current, pane.current, open])

  const onOpen = () => setOpen(x => !x);

  return <div ref={root} className={className || 'dropdown'}>
    <div style={{ width: "100%" }}>
      <a ref={dropdown} href='#' onClick={onOpen}>
        {toggle}
      </a>
    </div>
    {
      open ?
        <div ref={pane} className="pane">
          {content}
        </div> :
        null
    }
  </div>;
};

Dropdown.propTypes = {
  className: PropTypes.string,
  toggle: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
}

Dropdown.defaultProps = {
  className: 'dropdown'
}

export default forwardRef(Dropdown);
