import {Area, PilesElement, Position} from './solitaire.types';

export const INITIAL_POINTS = 0;

export const MIN_CARD_HEIGHT = 333;
export const MIN_CARD_WIDTH = getCardWidthByHeight();
export const MIN_PILE_MARGIN = getPileMarginByCardHeight();
export const MIN_OFFSET_IN_PILE = getOffsetInPileByHeight();

export const FOUNDATIONS_PILES_COUNT = 4;
export const HAND_PILES_COUNT = 2;
export const TABLEAU_PILES_COUNT = 7;

export const initialPosition: Position = {x: 0, y: 0};
export const initialPilesElement: PilesElement = {
  0: {
    rootPosition: initialPosition,
    cards: [],
  },
};

export const initialPilesArea: Area = {
  ...initialPosition,
  width: 100,
  height: 100,
};

export function getCardWidthByHeight(height: number = MIN_CARD_HEIGHT): number {
  return height / 1.5;
}

export function getPileMarginByCardHeight(height: number = MIN_CARD_HEIGHT): number {
  return height / 2;
}

export function getOffsetInPileByHeight(height: number = MIN_CARD_HEIGHT): number {
  return height / 6;
}
