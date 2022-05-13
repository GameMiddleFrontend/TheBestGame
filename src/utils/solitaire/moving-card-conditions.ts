import {Card, CardRank, RED_CARD_COLORS} from './card';
import isEqual from 'lodash.isequal';

const isEqualsCardColors = (card_1: Card, card_2: Card): boolean => {
  const isRedCard_1 = RED_CARD_COLORS.includes(card_1.suit);
  const isRedCard_2 = RED_CARD_COLORS.includes(card_2.suit);

  return isRedCard_1 === isRedCard_2;
};

const isNextCardRank = (draggableCard: Card, targetCard: Card): boolean => {
  const cardRankArray = Object.keys(CardRank);

  const draggableCardRankIndex = cardRankArray.findIndex((rank) => rank == draggableCard.rank);
  const targetCardRankIndex = cardRankArray.findIndex((rank) => rank == targetCard.rank);

  return draggableCardRankIndex + 1 === targetCardRankIndex;
};

export const isDraggableCardConditions = (draggableCard: Card, targetCard: Card): boolean => {
  return (
    (targetCard &&
      !isEqual(draggableCard, targetCard) &&
      !isEqual(draggableCard.currentPile, targetCard.currentPile)
      //&&
      //!isEqualsCardColors(draggableCard, targetCard) &&
      //isNextCardRank(draggableCard, targetCard)
      ) ||
    (!targetCard && isDraggableCardToEmptyPileConditions(draggableCard))
  );
};

export const isDraggableCardToEmptyPileConditions = (draggableCard?: Card): boolean => {
  return !!draggableCard && draggableCard.rank === CardRank.KING;
};
