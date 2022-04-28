export const getPileStyle = (ctx: CanvasRenderingContext2D): CanvasRenderingContext2D => {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return ctx;
};
