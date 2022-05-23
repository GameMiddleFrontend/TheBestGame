import {Card, CardRank, CardSuit} from './card.types';
import {Area, DraggableCards, Options, Position} from '../solitaire.types';
import {getContextCanvas} from '../canvas';
import {checkPosition} from '../solitaire.utils';
import {getOffsetInPileByHeight} from '../solitaire.defaults';

const CARD_BACK_IMG_NAME = `card_back.svg`;

/** draw */
function drawCardImg(ctx: CanvasRenderingContext2D, card: Card, callback?: () => void) {
  const cardName = card.opened
    ? `${card.suit.toLocaleLowerCase()}_${card.rank.toLocaleLowerCase()}.svg`
    : CARD_BACK_IMG_NAME;

  const image = new Image();
  image.src = require(`/src/styles/images/cards/${cardName}`);

  const drawImage = () => {
    ctx.drawImage(image, card.currentPosition.x, card.currentPosition.y, card.options.width, card.options.height);
  };

  // Карта не всегда отрисовывается корректно при одном из вариантов
  drawImage();
  image.addEventListener('load', () => {
    drawImage();
    if (callback) {
      callback();
    }
  });
}

export function drawCard(ctx: CanvasRenderingContext2D, card: Card, position?: Position, callback?: () => void) {
  if (position) {
    card.currentPosition = position;
  }

  drawCardImg(ctx, card, callback);
}

export function drawCards(ctx: CanvasRenderingContext2D, cards: Card[], firstCardPosition?: Position) {
  if (!!cards.length) {
    let indexItem = 0;

    const draw = () => {
      drawCard(
        ctx,
        cards[indexItem],
        firstCardPosition
          ? getTableauPileCardPosition(firstCardPosition, indexItem, cards[indexItem].options)
          : undefined,
        drawItem,
      );
    };

    const drawItem = () => {
      indexItem++;
      if (indexItem < cards.length) {
        draw();
      }
    };

    draw();
  }
}

export function drawDraggableCards(ctx: CanvasRenderingContext2D, draggableCards: DraggableCards, position?: Position) {
  if (position) {
    draggableCards.position = position;
  }

  ctx.putImageData(draggableCards.imageData, draggableCards.position.x, draggableCards.position.y);

  draggableCards.cards.forEach((card, index) => {
    card.currentPosition = getTableauPileCardPosition(draggableCards.position, index, draggableCards.cards[0].options);
  });
}

export function getCardsImageData(ctx: CanvasRenderingContext2D, cards: Card[]): ImageData {
  const point = getCardStackArea(cards);
  return ctx.getImageData(point.x, point.y, point.width, point.height);
}

export function clearDrawingCards(ctx: CanvasRenderingContext2D, cards: Card[]) {
  const point = getCardStackArea(cards);
  ctx.clearRect(point.x, point.y, point.width, point.height);
}

/** @deprecated */ /*TODO нужны манипуляции для фейковых карт */
export function clearDrawingCard(ctx: CanvasRenderingContext2D, card: Card, position?: Position) {
  ctx.clearRect(
    position ? position.x : card.currentPosition.x,
    position ? position.y : card.currentPosition.y,
    card.options.width,
    card.options.height,
  );
}

/** card manipulation */
/*TODO где-то проверять открыта ли карта, и нужно ли ее отрисовать заново чтобы использовать одну функцию */
export function moveCards(canvas: HTMLCanvasElement, draggableCards: DraggableCards, mousePosition: Position) {
  const ctx = getContextCanvas(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cards = draggableCards.cards;

  /*TODO относительно карты курсор должен оставаться там же
       пока считаем, что позиция мыши ~ посередине перемещяемой колоды */
  const point = {
    x: mousePosition.x - cards[0].options.width / 2,
    y:
      mousePosition.y - (cards[0].options.height + cards.length * getOffsetInPileByHeight(cards[0].options.height)) / 2,
  };

  drawDraggableCards(ctx, draggableCards, point);
}

export function openCard(card: Card) {
  card.opened = true;
  card.draggable = true;
}

export function closeCard(card: Card) {
  card.opened = false;
  card.draggable = false;
}

/** checks and calculations */
export function checkCardPosition(card: Card, currentPosition: Position) {
  return checkPosition(currentPosition, card.currentPosition, card.options);
}

export function getCardStackArea(cards: Card[]): Area {
  const firstCard = cards[0];
  const lastCard = cards[cards.length - 1];

  return {
    x: firstCard.currentPosition.x,
    y: firstCard.currentPosition.y,
    width: lastCard.options.width,
    height: lastCard.currentPosition.y + lastCard.options.height - firstCard.currentPosition.y,
  };
}

export function getTableauPileCardPosition(rootPosition: Position, cardCount: number, cardOptions: Options): Position {
  return {
    x: rootPosition.x,
    y: rootPosition.y + cardCount * getOffsetInPileByHeight(cardOptions.height),
  };
}
