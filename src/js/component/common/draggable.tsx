import React from 'react';
import ReactDom from 'react-dom';
import hoistNonReactStatics from 'hoist-non-react-statics';

const draggable = <P extends object>(Component: React.ComponentType<P & {
  ref?: React.Ref<HTMLElement>
}>, selector: null | string = null) => {
  const Draggable = React.forwardRef<HTMLElement, P>((props: P, ref) => {
    const internalRef = React.useRef<HTMLElement | null>(null);
    const [[offsetX, offsetY], setOffset] = React.useState<[number, number]>([0, 0]);

    // Merge external `ref` with internal one
    React.useImperativeHandle(ref, () => internalRef.current!);

    const getDOMNode = (): HTMLElement | null => {
      if (internalRef.current instanceof HTMLElement) {
        return internalRef.current;
      }

      // For class component, must use findDOMNode
      let node = ReactDom.findDOMNode(internalRef.current);
      return node instanceof HTMLElement ? node : null;
    }

    // Add handlers
    React.useEffect(() => {
      const node = getDOMNode();
      const target = selector === null ? node : node?.querySelector(selector);
      if (target instanceof HTMLElement) {
        const onDrag = (event: MouseEvent) => {
          event.preventDefault();
          const [pinpointX, pinpointY] = [event.clientX, event.clientY];
          const onDrop = (event: MouseEvent) => {
            setOffset([offsetX + event.clientX - pinpointX, offsetY + event.clientY - pinpointY]);
          };
          const onUp = () => {
            document.removeEventListener('mousemove', onDrop);
            document.removeEventListener('mouseup', onUp);
          };
          document.addEventListener('mousemove', onDrop);
          document.addEventListener('mouseup', onUp);
        };
        target.addEventListener('mousedown', onDrag);
        return () => {
          target.removeEventListener('mousedown', onDrag);
        }
      }

      return undefined;
    }, [internalRef.current, offsetX, offsetY]);

    // Apply offset
    React.useEffect(() => {
      const node = getDOMNode();
      if (node) {
        if (offsetX || offsetY) {
          node.style.transform = `translate(${offsetX}px,${offsetY}px)`;
        } else {
          node.style.removeProperty('transform');
        }
      }
    }, [internalRef.current, offsetX, offsetY]);

    return <Component {...props} ref={internalRef}/>;
  });

  hoistNonReactStatics(Draggable, Component);

  return Draggable;
}

export default draggable;
