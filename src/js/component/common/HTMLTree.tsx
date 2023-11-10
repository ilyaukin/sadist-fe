import React, { HTMLProps } from 'react';
import Icon from '../../icon/Icon';
import { scrollToVisible } from '../../helper/scroll-helper';

interface HTMLTreeProps extends HTMLProps<any> {
  node: Node;
  offset?: number;
  textLimit?: number;
  parent?: HTMLTree;
  container?: HTMLElement;

  highlightElement(element: Element): any;

  blurElement(element: Element): any;

  selectElement(element: Element): any;
}

class HTMLTree extends React.Component<HTMLTreeProps> {
  static defaultProps = {
    offset: 24,
    textLimit: 400,
  }

  expanded = false;
  baseElement?: HTMLDivElement | null;
  imageElement?: HTMLImageElement | null;
  cellarElement?: HTMLDivElement | null;
  private parent?: HTMLTree;
  private children: HTMLTree[];

  constructor(props: HTMLTreeProps) {
    super(props);
    this.parent = props.parent;
    this.children = [];
  }

  setExpanded(expanded: boolean) {
    this.expanded = expanded;
    if (this.imageElement) {
      this.imageElement.src = expanded ? Icon.minus : Icon.plus;
      this.imageElement.alt = expanded ? '-' : '+';
    }
    if (this.cellarElement) {
      this.cellarElement.style.display = expanded ? '' : 'none';
    }
  }

  includeNode(node: Node): boolean {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
      case Node.COMMENT_NODE:
      case Node.CDATA_SECTION_NODE:
        return true;
      case Node.TEXT_NODE:
        return !!( node as Text ).data.trim();
      default:
        return false;
    }
  }

  representNode(node: Node, hasChildren: boolean): string {
    const { textLimit } = this.props;
    let text: string;
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        const tag = node.nodeName.toLowerCase();
        const attributes = ( node as Element ).attributes;
        let attributesRepr = '';
        for (let i = 0; i < attributes.length; i++) {
          const attribute = attributes.item(i);
          if (!attribute) {
            continue;
          }
          // todo escape attr? add color highlight?
          attributesRepr += ` ${attribute.name}="${attribute.value}"`;
        }
        return hasChildren ?
            `<${tag}${attributesRepr}>…</${tag}>` :
            `<${tag}${attributesRepr}/>`;
      case Node.TEXT_NODE:
        text = ( node as Text ).data;
        if (textLimit && text.length > textLimit) {
          return `${text.substr(0, textLimit)}…`;
        }
        return text;
      case Node.COMMENT_NODE:
        text = ( node as Text ).data;
        return `<!--${text}-->`;
      case Node.CDATA_SECTION_NODE:
        text = ( node as CDATASection ).data;
        return `<!${text}>`;
      default:
        // ignore other types for now
        return '…';
    }
  }

  select() {
    // apply style
    this.baseElement?.classList.add('node-selected');

    // expand tree up to the node
    let item = this.parent;
    while (item) {
      item.setExpanded(true);
      item = item.parent;
    }

    // scroll to the node
    let { container } = this.props;
    scrollToVisible(this.baseElement, container);
  }

  deselect() {
    this.baseElement?.classList.remove('node-selected');
  }

  search() {
    // apply style
    this.baseElement?.classList.add('node-search');

    // expand tree up to the node
    let item = this.parent;
    while (item) {
      item.setExpanded(true);
      item = item.parent;
    }
  }

  unsearch() {
    this.baseElement?.classList.remove('node-search');
  }

  render() {
    const {
      node,
      offset,
      textLimit,
      parent,
      container,
      highlightElement,
      blurElement,
      selectElement,
      ...props
    } = this.props;

    // keep tree node link in the element for faster access
    ( node as any ).__treeNode = this;

    const style: React.CSSProperties = {
      ...props.style,
      width: `calc(var(--node-width, 600px) - ${offset}px)`,
      marginLeft: `${offset}px`
    };
    const children: JSX.Element[] = [];
    node.childNodes.forEach((child: ChildNode) => {
      if (this.includeNode(child)) {
        children.push(<HTMLTree
            {...props}
            ref={(element: HTMLTree) => {
              if (element) {
                this.children.push(element);
              }
            }}
            node={child}
            offset={offset! + 24}
            textLimit={textLimit}
            parent={this}
            container={container}
            highlightElement={highlightElement}
            blurElement={blurElement}
            selectElement={selectElement}
        />);
      }
    });

    let elementProps: React.HTMLProps<HTMLDivElement> = {};
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      elementProps = {
        onMouseOver: () => highlightElement(element),
        onMouseOut: () => blurElement(element),
        onClick: () => selectElement(element),
      };
    }

    return <>
      <div
          {...props}
          ref={element => this.baseElement = element}
          style={style}
          {...elementProps}
      >
        {
          children.length ?
              <>
                <img
                    ref={element => this.imageElement = element}
                    className="item"
                    src={Icon.plus}
                    alt={'+'}
                    onClick={() => {
                      this.setExpanded(!this.expanded);
                    }}
                />
              </> :
              null
        }
        {this.representNode(node, !!children.length)}
      </div>
      {
        children.length ?
            <div ref={element => this.cellarElement = element}
                 className="cellar"
                 style={{ display: 'none' }}>
              {children}
            </div> :
            null
      }
    </>
  }
}

export default HTMLTree;
