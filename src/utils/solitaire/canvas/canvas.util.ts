import {Position} from '../solitaire.types';

export function getContextCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas?.getContext('2d') as CanvasRenderingContext2D;
}

export function drawMovingObject(
  canvas: HTMLCanvasElement,
  canvasAnimation: HTMLCanvasElement,
  startPos: Position,
  endPos: Position,
  obj: any,
  drawFunction: (ctx: CanvasRenderingContext2D, obj: any, position: Position) => void,
  finishDrawFunction: (ctx: CanvasRenderingContext2D, obj: any, position: Position) => void = drawFunction,
  callback?: (position: Position) => void,
) {
  const ctx = getContextCanvas(canvas);
  const ctxAnimation = getContextCanvas(canvasAnimation);

  drawFunction(ctxAnimation, obj, startPos);

  const counter = 15;
  let count = 1;

  const deltaX = (endPos.x - startPos.x) / counter;
  const deltaY = (endPos.y - startPos.y) / counter;

  let currentPoint = startPos;
  let nextPoint;

  const step = () => {
    nextPoint = {x: startPos.x + deltaX * count, y: startPos.y + deltaY * count};
    if ((nextPoint.x >= endPos.x && deltaX > 0) || (nextPoint.x <= endPos.x && deltaX < 0)) {
      nextPoint = endPos;
    }
    ctxAnimation.clearRect(0, 0, canvasAnimation.width, canvasAnimation.height);
    drawFunction(ctxAnimation, obj, nextPoint);

    currentPoint = nextPoint;
    if (count <= counter) {
      count++;
      window.requestAnimationFrame(step);
    } else {
      finishDrawFunction(ctx, obj, endPos);
      ctxAnimation.clearRect(0, 0, canvasAnimation.width, canvasAnimation.height);

      if (callback) {
        callback(endPos);
      }
    }
  };

  window.requestAnimationFrame(step);
}
