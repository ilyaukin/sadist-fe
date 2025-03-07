import React, { useRef, useState } from 'react';

interface SplitterProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  onSplit: (delta: number) => any;
}

/**
 * Divider which allows splitting areas by drag&drop
 */
const Splitter: React.FC<SplitterProps> = (
    {
      orientation, onSplit, ...rest
    }: SplitterProps) => {
  const [delta, setDelta] = useState(0);

  const mouseMoveHandler = useRef<(e: MouseEvent) => void>();
  const mouseUpHandler = useRef<(e: MouseEvent) => void>();
  const pos = useRef<number>();

  let getMousePos: (e: ( MouseEvent | React.MouseEvent<HTMLDivElement> )) => number;
  if (orientation == 'vertical') {
    getMousePos = e => e.clientX;
  } else {
    getMousePos = e => e.clientY;
  }

  const onMouseDown = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    if (!(e.buttons & 1)) {
      return;
    }
    pos.current = getMousePos(e);
    window.addEventListener('mousemove', mouseMoveHandler.current = onMouseMove);
    window.addEventListener('mouseup', mouseUpHandler.current = onMouseUp);
  }

  const onMouseMove = (e: MouseEvent) => {
    setDelta(getMousePos(e) - pos.current!);
  }

  const onMouseUp = (e: MouseEvent) => {
    onSplit(getMousePos(e) - pos.current!);
    setDelta(0);
    window.removeEventListener('mousemove', mouseMoveHandler.current!);
    window.removeEventListener('mouseup', mouseUpHandler.current!);
  }

  if (orientation == 'vertical') {
    return <div
        {...rest}
        style={{ position: 'relative', flex: '0 0 auto' }}
        onMouseDown={onMouseDown}
    >
      <div style={{
        cursor: 'col-resize',
        position: 'absolute',
        left: `${delta}px`,
        top: 0,
        height: '100%',
      }}>
        <wired-divider style={{ height: '100%' }} orientation="vertical"/>
      </div>
    </div>;
  } else {
    return <div
        {...rest}
        style={{ position: 'relative', width: '100%' }}
        onMouseDown={onMouseDown}
    >
      <div
          style={{
            cursor: 'row-resize',
            position: 'absolute',
            left: 0,
            top: `${delta}px`,
            width: '100%',
          }}
      >
        <wired-divider/>
      </div>
    </div>;
  }
}

Splitter.defaultProps = {
  orientation: 'horizontal',
}

export default Splitter;
