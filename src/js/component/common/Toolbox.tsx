import React from 'react';
import Dropdown from './Dropdown';
import draggable from './draggable';
import Icon from '../../icon/Icon';

interface ToolboxProps {
  allowCollapse: boolean;
  children?: React.ReactNode;
}

interface ToolboxState {
  collapsed: boolean;
}

interface ToolboxItemProps {
  children?: React.ReactNode;
}

interface ToolboxButtonProps {
  src?: string;
  alt?: string;
  title?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
}

interface ToolboxDropdownProps {
  className?: string;
  src?: string;
  alt?: string;
  title?: string;
  children?: React.ReactNode;
}

interface ToolboxSwitchProps {
  src?: string | { on: string; off: string; };
  alt?: string | { on: string; off: string; };
  title?: string | { on: string; off: string };
  state: 'on' | 'off';
  onClick?: React.EventHandler<React.MouseEvent>;
}

const ToolboxItem = ({ children }: ToolboxItemProps) => {
  return <div className="toolbox-item">{children}</div>;
}

const ToolboxButton = ({ src, alt, title, onClick }: ToolboxButtonProps) => {
  return <div className="toolbox-item">
    <wired-button onClick={onClick} title={title}>
      <img src={src} alt={alt}/>
    </wired-button>
  </div>;
}

const ToolboxDropdown = (
    { className, src, alt, title, children }: ToolboxDropdownProps
) => {
  return <div className={`toolbox-item ${className}`}>
    <Dropdown
        toggle={
          <wired-button title={title}>
            <img src={src} alt={alt}/>
          </wired-button>
        }
        content={children}
    />
  </div>;
}

const ToolboxSwitch = ({ src, alt, title, state, onClick }: ToolboxSwitchProps) => {
  src = typeof src == 'string' ? src : src?.[state];
  alt = typeof alt == 'string' ? alt : alt?.[state];
  title = typeof title == 'string' ? title : title?.[state];
  return <div className="toolbox-item">
    <wired-button
        title={title}
        onClick={onClick}
    >
      <img src={src} alt={alt}/>
    </wired-button>
  </div>;
}

class Toolbox extends React.Component<ToolboxProps, ToolboxState> {
  static Item = ToolboxItem;
  static Button = ToolboxButton;
  static Dropdown = ToolboxDropdown;
  static Switch = ToolboxSwitch;

  static defaultProps = {
    allowCollapse: true,
  }

  constructor(props: Readonly<ToolboxProps> | ToolboxProps) {
    super(props);
    this.state = { collapsed: false };
  }

  collapse = () => {
    this.setState({ ...this.state, collapsed: !this.state.collapsed });
  }

  renderCollapseIcon = () => <wired-button
      className="toolbox-collapse-button"
      onClick={this.collapse}
  >
    <img src={Icon.dots}/>
  </wired-button>;

  render() {
    return <div className="toolbox">
      {!this.state.collapsed && this.props.children}
      {this.props.allowCollapse && this.renderCollapseIcon()}
    </div>;
  }
}

export default draggable(Toolbox) as unknown as typeof Toolbox;
