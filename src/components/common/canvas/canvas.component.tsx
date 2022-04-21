import React from 'react';
import {useEffect, useRef} from 'react';
import {canvasTypes} from './canvas.types';

function GameCanvas({className}: canvasTypes) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref) {
    }
  }, []);

  return <canvas ref={ref} className={className} />;
}

export default GameCanvas;
