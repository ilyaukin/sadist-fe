import React, { useRef, useState } from 'react';

interface SplitterProps {
  onSplit: (delta: number) => any;
}

/**
 * Divider which allows splitting areas by drag&drop
 */
const Splitter = ({ onSplit }: SplitterProps) => {
  const [delta, setDelta] = useState(0);

  const mouseMoveHandler = useRef<(e: MouseEvent) => void>();
  const mouseUpHandler = useRef<(e: MouseEvent) => void>();
  const y = useRef<number>();

  const onMouseDown = (e: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    y.current = e.clientY;
    window.addEventListener('mousemove', mouseMoveHandler.current = onMouseMove);
    window.addEventListener('mouseup', mouseUpHandler.current = onMouseUp);
  }

  const onMouseMove = (e: MouseEvent) => {
    setDelta(e.clientY - y.current!);
  }

  const onMouseUp = (e: MouseEvent) => {
    onSplit(e.clientY - y.current!);
    setDelta(0);
    window.removeEventListener('mousemove', mouseMoveHandler.current!);
    window.removeEventListener('mouseup', mouseUpHandler.current!);
  }

  return <div
    style={{ position: 'relative', width: '100%' }}
    onMouseDown={onMouseDown}
  >
    <div
      style={{
        cursor: 'ns-resize',
        position: 'absolute',
        left: 0,
        top: delta,
        width: '100%',
      }}
    >
      <wired-divider/>
    </div>
  </div>
}

export default Splitter;
