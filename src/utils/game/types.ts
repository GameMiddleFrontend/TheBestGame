import {Card, CardLeftUp, CardSuit} from '../../models/game.models';

type Tree = {
  rootPosition: CardLeftUp;
  finished?: boolean;
  count?: number;
  nextCard?: Card | null;
};

type TargetTree = {
  suite?: CardSuit;
} & Tree;

type SecondaryTree = Tree;

export {TargetTree, SecondaryTree};
