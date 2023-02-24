import React from 'react';

interface UniselectorProps {
  selected: boolean;
  text: string;
  onClick: () => any;
}

const Uniselector = (props: UniselectorProps) => {
  return <span className="uniselector">
        {props.selected ?
          <b>{props.text}</b> :
          <a href="#" onClick={props.onClick}>{props.text}</a>
        }
      </span>;
}

export default Uniselector;
