import {Card, CardLeftUp, CardSuit, Position} from '../../models/card.models';

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

interface Pile {
  rootPosition: Position;
  finished?: boolean;
  cards?: Card[] | null;
  nextCard?: Card | null;
}

type TableauPile = Pile;
type HandPile = Pile;
type FoundationPile = Pile;

export {TargetTree, TableauTree, Tree, TableauPile, HandPile, FoundationPile, Pile};
