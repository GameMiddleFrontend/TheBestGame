import {Area, isPile, Options, Pile, Position} from './solitaire.types';
import {getPileStyle, getSelectedCardsStyle, getTextStyle} from './canvas';
import {Card, drawCard} from './card';

export function drawElementPile(
  ctx: CanvasRenderingContext2D,
  element: Record<string, Pile> | Pile,
  cardOptions: Options,
) {
  ctx = getPileStyle(ctx);

  const drawPile = (pile: Pile) => {
    const pileArea: Area = {
      x: pile.rootPosition.x,
      y: pile.rootPosition.y,
      width: cardOptions.width,
      height: cardOptions.height,
    };

    ctx.beginPath();
    ctx.clearRect(pileArea.x, pileArea.y, pileArea.width, pileArea.height);
    ctx.strokeRect(pileArea.x, pileArea.y, pileArea.width, pileArea.height);
    ctx.closePath();
  };

  if (isPile(element)) {
    drawPile(element);
  } else {
    for (const [key, pile] of Object.entries(element).values()) {
      drawPile(pile);
    }
  }
}

export function drawCollectButton(
  ctx: CanvasRenderingContext2D,
  pilePosition: Position,
  pileMargin: number,
  cardOptions: Options,
) {
  const buttonPadding = 5;

  const width = cardOptions.width - buttonPadding;
  const height = cardOptions.height / 4;

  const buttonArea: Area = {
    x: pilePosition.x + cardOptions.width + pileMargin + (cardOptions.width - width) / 2,
    y: pilePosition.y + (cardOptions.height - height) / 2,
    width: width,
    height: height,
  };

  const button = new Path2D();
  button.rect(buttonArea.x, buttonArea.y, buttonArea.width, buttonArea.height);

  ctx = getTextStyle(ctx);

  ctx.stroke(button);
  ctx.fillText(
    'Собрать',
    buttonArea.x + buttonArea.width / 2,
    buttonArea.y + buttonArea.height / 2,
    buttonArea.width - buttonPadding * 2,
  );

  return button;
}

export function drawSelectedCards(ctx: CanvasRenderingContext2D, cards: Card | Card[], offsetInPile: number) {
  const cardsCount = Array.isArray(cards) ? cards.length : 1;
  const firstCard = Array.isArray(cards) ? cards[0] : cards;
  const cardsHeight = firstCard.options.height * cardsCount + offsetInPile * (cardsCount - 1);

  ctx = getSelectedCardsStyle(ctx);
  ctx.strokeRect(firstCard.currentPosition.x, firstCard.currentPosition.y, firstCard.options.width, cardsHeight);

  drawCard(ctx, cards);
}

export function clearSelectedCards(ctx: CanvasRenderingContext2D, cards: Card | Card[], offsetInPile: number) {
  const cardsCount = Array.isArray(cards) ? cards.length : 1;
  const firstCard = Array.isArray(cards) ? cards[0] : cards;
  const cardsHeight = firstCard.options.height * cardsCount + offsetInPile * (cardsCount - 1);

  const borderWidth = 5;
  ctx.clearRect(
    firstCard.currentPosition.x - borderWidth,
    firstCard.currentPosition.y - borderWidth,
    firstCard.options.width + borderWidth * 2,
    cardsHeight + borderWidth * 2,
  );
}
