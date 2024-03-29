import React, { ReactNode } from 'react';

interface UniselectorProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => any;
}

const Uniselector = (props: UniselectorProps) => {
  return <>
    <span className="uniselector">
        {
          props.selected ?
              <b>{props.children}</b> :
              <a className="bare" onClick={props.onClick}>{props.children}</a>
        }
    </span>
    {' '}
  </>;
}

export default Uniselector;
