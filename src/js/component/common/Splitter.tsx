import React, { useEffect, useRef, useState } from 'react';

interface SplitterProps {
  onSplit: (delta: number) => any;
}

interface SplitterState {
  y?: number;
  isSplitting: boolean;
  delta: number;
}

/**
 * Divider which allows splitting areas by drag&drop
 */
const Splitter = ({ onSplit }: SplitterProps) => {
  const [state, setState] = useState<SplitterState>({
    isSplitting: false,
    delta: 0
  });

  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    container.current!.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  const onMouseDown = (e: MouseEvent) => {
    setState({ ...state, y: e.clientY, isSplitting: true });
  }

  const onMouseMove = (e: MouseEvent) => {
    if (state.isSplitting) {
      setState({ ...state, delta: e.clientY - state.y! });
    }
  }

  const onMouseUp = (e: MouseEvent) => {
    if (state.isSplitting) {
      let delta = e.clientY - state.y!;
      setState({ delta: 0, isSplitting: false });
      onSplit(delta);
    }
  }

  return <div
    ref={container}
    style={{ position: 'relative' }}
  >
    <div
      style={{
        cursor: 'ns-resize',
        position: 'absolute',
        left: 0,
        top: state.delta || 0
      }}
    >
      <wired-divider/>
    </div>
  </div>
}

export default Splitter;
