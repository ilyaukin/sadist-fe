import React from 'react';
import Dropdown from './Dropdown';

interface ToolboxProps {
  children?: React.ReactNode;
}

interface ToolboxItemProps {
  children?: React.ReactNode;
}

interface ToolboxButtonProps {
  src?: string;
  alt?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}

interface ToolboxDropdownProps {
  className?: string;
  src?: string;
  alt?: string;
  children?: React.ReactNode;
}

interface ToolboxSwitchProps {
  src?: string | { on: string; off: string; };
  alt?: string | { on: string; off: string; };
  state: 'on' | 'off';
  onClick?: React.EventHandler<React.MouseEvent>;
}

const ToolboxItem = ({ children }: ToolboxItemProps) => {
  return <div className="toolbox-item">{children}</div>;
}

const ToolboxButton = ({ src, alt, onClick }: ToolboxButtonProps) => {
  return <div className="toolbox-item">
    <wired-button onClick={onClick}>
      <img src={src} alt={alt}/>
    </wired-button>
  </div>;
}

const ToolboxDropdown = (
    { className, src, alt, children }: ToolboxDropdownProps
) => {
  return <div className={`toolbox-item ${className}`}>
    <Dropdown
        toggle={
          <wired-button>
            <img src={src} alt={alt}/>
          </wired-button>
        }
        content={children}
    />
  </div>;
}

const ToolboxSwitch = ({ src, alt, state, onClick }: ToolboxSwitchProps) => {
  src = typeof src == 'string' ? src : src?.[state];
  alt = typeof alt == 'string' ? alt : alt?.[state];
  return <div className="toolbox-item">
    <wired-button
        onClick={onClick}
    >
      <img src={src} alt={alt}/>
    </wired-button>
  </div>;
}

class Toolbox extends React.Component<ToolboxProps, {}> {
  static Item = ToolboxItem;
  static Button = ToolboxButton;
  static Dropdown = ToolboxDropdown;
  static Switch = ToolboxSwitch;

  render() {
    return <div className="toolbox">
      {this.props.children}
    </div>;
  }
}

export default Toolbox;
