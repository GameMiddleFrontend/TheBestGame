import {Card} from './card.types';
import {Position} from '../solitaire.types';
import {getContextCanvas} from '../canvas/canvas.util';

const CARD_BACK_IMG_NAME = `card_back.svg`;

export function drawCard(ctx: CanvasRenderingContext2D, card: Card, position?: Position) {
  if (position) {
    card.currentPosition = position;
  }

  drawCardImg(ctx, card);
}

function drawCardImg(ctx: CanvasRenderingContext2D, card: Card) {
  const cardName = card.opened
    ? `${card.suit.toLocaleLowerCase()}_${card.rank.toLocaleLowerCase()}.svg`
    : CARD_BACK_IMG_NAME;

  const image = new Image();
  image.src = require(`/src/styles/images/cards/${cardName}`);

  const drawImage = () => {
    ctx.drawImage(image, card.currentPosition.x, card.currentPosition.y, card.options.width, card.options.height);
    //console.log('drawImage', card.currentPosition.x, card.currentPosition.y);
  };

  // Карта не всегда отрисовывается корректно при одном из вариантов
  drawImage();
  image.addEventListener('load', () => {
    drawImage();
  });
}

export function clearDrawingCard(ctx: CanvasRenderingContext2D, card: Card, position?: Position) {
  ctx.clearRect(
    position ? position.x : card.currentPosition.x,
    position ? position.y : card.currentPosition.y,
    card.options.width,
    card.options.height,
  );
}

export function clearDrawingCardFromPile(
  ctx: CanvasRenderingContext2D,
  card: Card,
  deleteCardFromPile: (card: Card) => void,
) {
  clearDrawingCard(ctx, card);
  deleteCardFromPile(card);
}

export function checkCardPosition(card: Card, currentPosition: Position) {
  return (
    currentPosition.x >= card.currentPosition.x &&
    currentPosition.x <= card.currentPosition.x + card.options.width &&
    currentPosition.y >= card.currentPosition.y &&
    currentPosition.y <= card.currentPosition.y + card.options.height
  );
}

export function moveCards(canvas: HTMLCanvasElement, card: Card, mousePosition: Position){
  /*TODO несколько карт */
  const ctx = getContextCanvas(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /*TODO относительно карты курсор должен оставаться там же */
  const point = {
    x: mousePosition.x - card.options.width / 2,
    y: mousePosition.y - card.options.height / 2,
  };

  drawCard(ctx, card, point);
}

export function openCard(card: Card) {
  card.opened = true;
  card.draggable = true;
}
