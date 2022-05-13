import {Card} from './card';

export type Position = {
  x: number;
  y: number;
};

export type Options = {
  width: number;
  height: number;
};

export type Area = Position & Options;

export type Pile = {
  rootPosition: Position;
  cards: Card[];
  finished?: boolean;
};

export type PilesElement = Record<number, Pile>;

export type DraggableCards = {
  cards: Card[];
  imageData: ImageData;
  position: Position;
};

export function isPile(element: Pile | PilesElement): element is Pile {
  return (element as Pile).rootPosition !== undefined;
}
