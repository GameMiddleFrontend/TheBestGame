type Card = {
  rank: CardRank;
  suit: CardSuit;
  opened: boolean;
  draggable: boolean;
  position: CardLeftUp | null;
  next: Card | null;
  prev: Card | null;
};

enum CardSuit {
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
  DIAMONDS = 'DIAMONDS',
  CLUBS = 'CLUBS',
}

enum CardSuitValues {
  HEARTS = '♥',
  SPADES = '♠',
  DIAMONDS = '♦',
  CLUBS = '♣',
}

enum CardRank {
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

enum CardRankValues {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
}

type CardLeftUp = {
  x: number;
  y: number;
};

export const RED_CARD_COLORS = [CardSuit.HEARTS, CardSuit.DIAMONDS];
export const BLACK_CARD_COLORS = [CardSuit.SPADES, CardSuit.CLUBS];

function getStringKeys<T extends Record<any, any>>(obj: T) {
  return Object.keys(obj).filter((item) => isNaN(parseInt(item, 10)));
}

export {Card, CardSuit, CardSuitValues, CardRank, CardRankValues, CardLeftUp, getStringKeys};
