import {Card, CardSuit, CardRank, getStringKeys} from './card/card.types';
import {Options, Position} from './solitaire.types';

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
