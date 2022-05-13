import {Options, Pile, Position} from '../solitaire.types';

export type Card = {
  rank: CardRank;
  suit: CardSuit;
  opened: boolean;
  draggable: boolean;
  selected: boolean;
  options: Options;
  currentPosition: Position;
  prev?: Card;
  next?: Card;
  currentPile: Pile;
};

export enum CardSuit {
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
}

export enum CardRank {
  ACE = 'ACE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN',
  JACK = 'JACK',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

export const RED_CARD_COLORS = [CardSuit.HEARTS, CardSuit.DIAMONDS];
export const BLACK_CARD_COLORS = [CardSuit.SPADES, CardSuit.CLUBS];

export function getStringKeys<T extends Record<any, any>>(obj: T) {
  return Object.keys(obj).filter((item) => isNaN(parseInt(item, 10)));
}
