import {CardLeftUp} from '../../../models/game.models';

class GameSuiteUtil {
  renderHeart(ctx: CanvasRenderingContext2D, start: CardLeftUp) {
    ctx.beginPath();
    ctx.fillStyle = 'red';

    ctx.translate(start.x, start.y);
    ctx.bezierCurveTo(37, 18, 35, 12, 25, 12);
    ctx.bezierCurveTo(10, 12, 10, 31, 10, 31);
    ctx.bezierCurveTo(10, 40, 20, 51, 37, 60);
    ctx.bezierCurveTo(55, 51, 65, 40, 65, 31);
    ctx.bezierCurveTo(65, 31, 65, 12, 50, 12);
    ctx.bezierCurveTo(42, 12, 37, 18, 37, 20);
    ctx.fill();
    ctx.translate(-start.x, -start.y);
    ctx.closePath();
  }
}

export default new GameSuiteUtil();
