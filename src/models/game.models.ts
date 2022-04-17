type Card = {
  value: CardValue;
  suit: CardSuit;
  position: CardLeftUp | null;
  canTake: boolean;
  next: Card | null;
  prev: Card | null;
};

enum CardSuit {
  Hearts,
  Spades,
  Diamonds,
  Clubs,
}

enum CardValue {
  Ace,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  Jack,
  Queen,
  King,
}

type CardLeftUp = {
  x: number;
  y: number;
};

function getStringKeys<T extends Record<any, any>>(obj: T) {
  return Object.keys(obj).filter((item) => isNaN(parseInt(item, 10)));
}

export {Card, CardSuit, CardValue, CardLeftUp, getStringKeys};
