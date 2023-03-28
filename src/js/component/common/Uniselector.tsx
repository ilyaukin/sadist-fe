import React from 'react';

interface UniselectorProps {
  selected: boolean;
  children: string;
  onClick: () => any;
}

const Uniselector = (props: UniselectorProps) => {
  return <span className="uniselector">
        {props.selected ?
          <b>{props.children}</b> :
          <a href="#" onClick={props.onClick}>{props.children}</a>
        }
      </span>;
}

export default Uniselector;
