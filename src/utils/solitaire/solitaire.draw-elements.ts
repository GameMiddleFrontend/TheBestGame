import {Options, Pile} from './solitaire.types';
import {getNotSelectedCardsStyle, getPileStyle, getSelectedCardsStyle} from './canvas/canvas-styles.util';
import {Card} from './card/card.types';
import {drawCard} from './card/card';

export function drawElementPile(ctx: CanvasRenderingContext2D, element: Record<string, Pile>, cardOptions: Options) {
  ctx = getPileStyle(ctx);

  for (const [key, pile] of Object.entries(element).values()) {
    ctx.strokeRect(pile.rootPosition.x, pile.rootPosition.y, cardOptions.width, cardOptions.height);
  }
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
