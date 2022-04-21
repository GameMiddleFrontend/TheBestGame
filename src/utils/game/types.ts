import {Card, CardLeftUp, CardSuit} from '../../models/card.models';

type Tree = {
  rootPosition: CardLeftUp;
  finished?: boolean;
  cards?: Card[] | null;
  nextCard?: Card | null;
};

type TargetTree = {
  suite?: CardSuit;
} & Tree;

type TableauTree = Tree;

export {TargetTree, TableauTree, Tree};
