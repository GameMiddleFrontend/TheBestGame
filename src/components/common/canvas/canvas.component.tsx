import React from 'react';
import {canvasTypes} from './canvas.types';

function GameCanvas({className}: canvasTypes) {
  return <canvas className={className} />;
}

export default GameCanvas;
