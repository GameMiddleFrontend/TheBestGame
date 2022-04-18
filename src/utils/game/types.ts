import {Card, CardLeftUp, CardSuit} from '../../models/game.models';

type Tree = {
  rootPosition: CardLeftUp;
  finished?: boolean;
  cards?: Card[] | null;
  nextCard?: Card | null;
};

type TargetTree = {
  suite?: CardSuit;
} & Tree;

type SecondaryTree = Tree;

export {TargetTree, SecondaryTree, Tree};
