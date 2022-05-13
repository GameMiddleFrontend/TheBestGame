export function getPileStyle(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return ctx;
}

export function getSelectedCardsStyle(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return ctx;
}

export function getNotSelectedCardsStyle(ctx: CanvasRenderingContext2D): CanvasRenderingContext2D {
  ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
  ctx.lineWidth = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return ctx;
}
