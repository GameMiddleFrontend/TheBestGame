export function getContextCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas?.getContext('2d') as CanvasRenderingContext2D;
}
