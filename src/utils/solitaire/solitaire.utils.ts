import {Card, CardSuit, CardRank, getStringKeys} from './card';
import {Options, Pile, PilesElement, Position} from './solitaire.types';

export function getCardDeck(cardOptions: Options, initPosition: Position): Card[] {
  const suitKeys = getStringKeys(CardSuit);
  const valueKeys = getStringKeys(CardRank);
  return suitKeys.reduce((result: Array<Card>, suit: unknown): Array<Card> => {
    let prevCard: Card;

    valueKeys.forEach((value: unknown) => {
      const newCard: Card = {
        rank: value as CardRank,
        suit: suit as CardSuit,
        opened: false,
        draggable: false,
        options: cardOptions,
        currentPosition: initPosition,
        prev: prevCard,
      };
      if (prevCard) {
        prevCard.next = newCard;
      }
      result.push(newCard);
      prevCard = newCard;
    });
    return result;
  }, []);
}

export function checkPosition(currentPosition: Position, objPosition: Position, objOptions?: Options) {
  return (
    currentPosition.x >= objPosition.x &&
    currentPosition.x <= objPosition.x + (objOptions?.width ?? 0) &&
    currentPosition.y >= objPosition.y &&
    currentPosition.y <= objPosition.y + (objOptions?.height ?? 0)
  );
}

export function checkPilePosition(checkedPile: Pile, pileElement: PilesElement) {
  if (pileElement) {
    return Object.values(pileElement).find((pile) => {
      if (pile && checkPosition(checkedPile.rootPosition, pile.rootPosition)) {
        return true;
      }
    });
  }
}
