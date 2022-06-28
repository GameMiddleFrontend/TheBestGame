import {drawMovingObject, getContextCanvas} from './canvas';
import {Options, Position, Pile, PilesElement, Area, DraggableCards} from './solitaire.types';
import {
  Card,
  CardRank,
  checkCardPosition,
  clearDrawingCard,
  clearDrawingCards,
  closeCard,
  drawCard,
  drawCards,
  drawDraggableCards,
  getCardsImageData,
  getTableauPileCardPosition,
  moveCards,
  openCard,
} from './card';
import {drawCollectButton, drawElementPile} from './solitaire.draw-elements';
import {checkPilePosition, checkPosition, getCardDeck} from './solitaire.utils';
import shuffle from '../helpers/shuffle';
import isEqual from 'lodash.isequal';
import {
  FOUNDATIONS_PILES_COUNT,
  getCardWidthByHeight,
  getOffsetInPileByHeight,
  getPileMarginByCardHeight,
  HAND_PILES_COUNT,
  INITIAL_POINTS,
  initialPilesArea,
  initialPilesElement,
  initialPosition,
  MIN_CARD_HEIGHT,
  MIN_CARD_WIDTH,
  MIN_OFFSET_IN_PILE,
  MIN_PILE_MARGIN,
  TABLEAU_PILES_COUNT,
} from './solitaire.defaults';
import {isDraggableCardConditions} from './moving-card-conditions';

class GameEngine {
  private static _instance: GameEngine;

  private readonly gameCanvas: HTMLCanvasElement;
  private readonly animationCanvas: HTMLCanvasElement;

  /** Класс контейнера с канвасами */
  private readonly canvasContainer: HTMLDivElement;

  /** Основное поле размещения стопок карт */
  private pilesArea: Area = initialPilesArea;

  private isStarted = false;
  private draggableCards?: DraggableCards;

  /** основная колода */
  private readonly cardDeckSorted: Array<Card> = [];
  private cardDeck: Array<Card> = [];
  private cardDeckOld: Array<Card> = [];

  private startPilePosition: Position = initialPosition;

  private cardOptions: Options = {
    width: MIN_CARD_WIDTH,
    height: MIN_CARD_HEIGHT,
  };

  /** Отступ между стопками карт */
  private pileMargin = MIN_PILE_MARGIN;

  /** Смещение карты в стопке */
  private offsetInPile = MIN_OFFSET_IN_PILE;

  /** хранение стопок карт, по принципу:
   * arr[0] - последняя карта в стопке
   * arr[arr.length - 1] - верхняя, открытая карта */

  private gamePiles: Pile[] = [];
  /** Базы - верхние колоды разложенные по мастям */
  private foundations: PilesElement = initialPilesElement;

  /** Основная часть раскладки пасьянса */
  private tableau: PilesElement = initialPilesElement;

  /** Дополнительная колода в левом верхнем углу:
   * карты, оставшиеся после раскладывания пасьянса */
  private hand: PilesElement = initialPilesElement;

  public points: number = INITIAL_POINTS;
  public changePoints: (points: number) => void;
  public gameOverCallBack: (isWin: boolean, points: number) => void;

  private isVisibleButtonCollect = false;

  constructor(
    gameCanvas: HTMLCanvasElement,
    animationCanvas: HTMLCanvasElement,
    canvasContainer: HTMLDivElement,
    changePoints: (points: number) => void,
    gameOverCallBack: (isWin: boolean, points: number) => void,
  ) {
    this.gameCanvas = gameCanvas;
    this.animationCanvas = animationCanvas;
    this.canvasContainer = canvasContainer;
    this.changePoints = changePoints;
    this.gameOverCallBack = gameOverCallBack;

    this.resizeCanvas();

    this.cardDeckSorted = getCardDeck(this.cardOptions, this.startPilePosition);

    /*if (GameEngine._instance) {
      return GameEngine._instance;
    }

    GameEngine._instance = this;*/
    return this;
  }

  private resizeCanvas() {
    if (this.canvasContainer) {
      const {width, height} = this.canvasContainer.getBoundingClientRect();
      this.gameCanvas.width = width;
      this.gameCanvas.height = height;
      this.animationCanvas.width = width;
      this.animationCanvas.height = height;

      const cardHeight = height / 5;

      this.cardOptions = {
        width: getCardWidthByHeight(cardHeight),
        height: cardHeight,
      };

      this.pileMargin = getPileMarginByCardHeight(cardHeight);
      this.offsetInPile = getOffsetInPileByHeight(cardHeight);

      /* TODO отступ слева должен расчитываться из ширины правой панели */
      this.pilesArea = {
        x: this.cardOptions.width,
        y: this.cardOptions.height / 2,
        width: width - this.cardOptions.width * 2,
        height: height - this.cardOptions.height,
      };
    }
  }

  private setPoints(points: number) {
    this.points = points;
    this.changePoints(this.points);
  }

  public renderStartElements() {
    this.isStarted = false;

    this.setPoints(INITIAL_POINTS);

    getContextCanvas(this.gameCanvas).clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    getContextCanvas(this.animationCanvas).clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);

    this.renderStartGamePosition();

    this.canvasContainer.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvasContainer.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvasContainer.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvasContainer.removeEventListener('mouseout', this.handleMouseUp.bind(this));
  }

  public startGame(isShuffle = true) {
    this.renderStartElements();

    this.isStarted = true;

    this.cardDeckSorted.map((card) => {
      closeCard(card);
      card.currentPosition = this.startPilePosition;
    });

    this.cardDeck = isShuffle || this.cardDeckOld.length === 0 ? shuffle(this.cardDeckSorted) : this.cardDeckOld;
    this.cardDeckOld = this.cardDeck.slice();

    this.fillTableauPile().then(() => {
      this.changeRemainStackPosition();

      this.canvasContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvasContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvasContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
      this.canvasContainer.addEventListener('mouseout', this.handleMouseUp.bind(this));
    });
  }

  renderStartGamePosition() {
    this.renderFoundations();
    this.renderHand();
    this.renderTableau();

    this.gamePiles = Object.values(this.foundations)
      .concat(Object.values(this.hand))
      .concat(Object.values(this.tableau));

    this.startPilePosition = {
      x: this.pilesArea.x + this.pilesArea.width / 2 - this.cardOptions.width / 2,
      y: this.pilesArea.y + this.pilesArea.height - this.cardOptions.height / 2,
    };

    const firstCard = {...this.cardDeckSorted[0], opened: false};

    //Имитируем колоду карт
    drawCard(getContextCanvas(this.gameCanvas), firstCard, this.startPilePosition);
  }

  /** PILES */
  private getElementPile(
    element: Record<number, Pile> = {},
    coordX = 0,
    coordY = 0,
    pilesCount = 1,
    isRightMove = true,
  ): Record<number, Pile> {
    const sign = isRightMove ? 1 : -1;

    for (let i = 0; i < pilesCount; i++) {
      coordX += sign * this.cardOptions.width;

      const point: Position = {x: coordX, y: coordY};

      const position: Pile = {rootPosition: point, cards: []};
      element = Object.assign(element, {[i]: position});

      coordX += sign * this.pileMargin;
    }

    return element;
  }

  private renderFoundations() {
    const coordX: number = this.pilesArea.x + (this.cardOptions.width + this.pileMargin) * 3;
    const coordY = this.pileMargin;

    this.foundations = this.getElementPile({...this.foundations}, coordX, coordY, FOUNDATIONS_PILES_COUNT);
    drawElementPile(getContextCanvas(this.gameCanvas), this.foundations, this.cardOptions);
  }

  private renderHand() {
    const coordX: number = this.pilesArea.x;
    const coordY = this.pileMargin;

    this.hand = this.getElementPile({...this.hand}, coordX, coordY, HAND_PILES_COUNT);
    drawElementPile(getContextCanvas(this.gameCanvas), this.hand, this.cardOptions);
  }

  private renderTableau() {
    const coordX: number = this.pilesArea.x;
    const coordY = this.pilesArea.y + this.cardOptions.height + this.cardOptions.height / 2;

    this.tableau = this.getElementPile({...this.tableau}, coordX, coordY, TABLEAU_PILES_COUNT);
    drawElementPile(getContextCanvas(this.gameCanvas), this.tableau, this.cardOptions);
  }

  /** Раздаем карты */
  private fillTableauPile(pileNumber = 0, success?: (value: PromiseLike<unknown> | unknown) => void) {
    return new Promise((resolve) => {
      if (pileNumber >= TABLEAU_PILES_COUNT) {
        if (success) {
          return success('allIn');
        }
      }
      success = success || resolve;

      const currentTableauPile = this.tableau[pileNumber];

      const currentCard = this.getCardFromDeck(currentTableauPile, pileNumber);

      const daftNewCard = (position: Position) => {
        if (currentTableauPile.cards.length > pileNumber) {
          pileNumber++;
        }

        this.fillTableauPile(pileNumber, success);
      };

      currentCard &&
        this.changeCardsPosition(currentCard, this.startPilePosition, currentCard.currentPosition, daftNewCard);
    });
  }

  /** Раздаем карты */
  private collectTableauPile = () => {
    if (!Object.values(this.tableau).find((pile) => pile.cards.length > 0)) {
      this.checkPoints();
      return;
    }

    const daftNewCard = (pilePosition: Position) => {
      this.collectTableauPile();
    };

    let isChangeCard = false;
    let foundationIndex = 0;

    while (!isChangeCard) {
      const foundation = this.foundations[foundationIndex];

      const desiredCard = foundation?.cards?.at(-1)?.next;
      if (desiredCard) {
        const currentPile = Object.values(this.tableau).find((pile) => {
          const card = pile.cards.at(-1);
          return card && card.rank === desiredCard.rank && card.suit === desiredCard.suit;
        });

        if (currentPile) {
          const currentCard = currentPile.cards.pop();
          if (currentCard) {
            foundation.cards.push(currentCard);

            clearDrawingCards(getContextCanvas(this.gameCanvas), [currentCard]);
            this.deleteCardsFromPile([currentCard]);

            this.changeCardsPosition(currentCard, currentPile.rootPosition, foundation.rootPosition, daftNewCard);
            currentCard.currentPile = foundation;
            isChangeCard = true;
          }
        }
      }

      foundationIndex = foundationIndex === Object.keys(this.foundations).length - 1 ? 0 : ++foundationIndex;
    }
  };

  private rerenderPile(pile: Pile) {
    const ctx = getContextCanvas(this.gameCanvas);
    if (!!pile.cards.length) drawCards(ctx, pile.cards);
    else drawElementPile(ctx, pile, this.cardOptions);
  }

  /** CARDS */
  getCardFromDeck(currentTableauPile: Pile, pileNumber: number) {
    const {rootPosition} = currentTableauPile;

    const cardNumber = currentTableauPile.cards.length;

    /*TODO use getTableauPileCardPosition */
    const cardPosition: Position = {
      x: rootPosition.x,
      y: rootPosition.y + cardNumber * this.offsetInPile,
    };

    const currentCard = this.cardDeck.pop();

    if (currentCard) {
      currentTableauPile.cards.push(currentCard);
      currentCard.opened = cardNumber === pileNumber;
      currentCard.draggable = cardNumber === pileNumber;
      currentCard.currentPosition = cardPosition;
      currentCard.currentPile = currentTableauPile;
    }
    return currentCard;
  }

  private changeCardsPosition(
    cards: Card | Card[],
    startPos: Position | null,
    endPos: Position,
    callback?: (position: Position) => void,
  ) {
    if (!Array.isArray(cards)) {
      cards = [cards];
    }
    const startCardPosition = startPos ?? cards[0].currentPosition;

    drawMovingObject(
      this.gameCanvas,
      this.animationCanvas,
      startCardPosition,
      endPos,
      cards,
      drawCards,
      undefined,
      callback,
    );
  }

  /*TODO почти копия changeCardPosition, придти к одной реализации */
  private changeDraggableCardsPosition(
    draggableCards: DraggableCards,
    endPos: Position,
    callback?: (position: Position) => void,
  ) {
    const startCardPosition = draggableCards.position;

    const finishDrawCards: typeof drawDraggableCards = (ctx, draggableCards, position) => {
      drawCards(ctx, draggableCards.cards, position);
    };

    drawMovingObject(
      this.gameCanvas,
      this.animationCanvas,
      startCardPosition,
      endPos,
      draggableCards,
      drawDraggableCards,
      finishDrawCards,
      callback,
    );
  }

  changeRemainStackPosition() {
    const handPile = this.hand[0];
    const {rootPosition} = handPile;

    clearDrawingCard(getContextCanvas(this.gameCanvas), this.cardDeck[0], this.startPilePosition);

    handPile.cards = this.cardDeck;
    handPile.cards.forEach((card: Card) => {
      card.currentPile = handPile;
      this.changeCardsPosition(card, this.startPilePosition, rootPosition);
    });
    this.cardDeck = [];
  }

  private findPileByPosition(position: Position) {
    return this.gamePiles.find((pile) => {
      return checkPosition(position, pile.rootPosition, this.cardOptions);
    });
  }

  private findCardsByCondition(
    condition: (card: Card) => boolean,
    isSearchFromEndOfPile: (pile: Pile) => boolean = () => false,
  ): Card[] | undefined {
    const cards = this.cardDeckSorted.filter((card) => {
      return condition(card);
    });

    if (cards && !!cards.length) {
      const cardsPile = cards[0].currentPile;
      const lastCardIndex = cardsPile.cards.length - 1;

      const isSearchFromEnd = isSearchFromEndOfPile(cardsPile);

      const searchStack = isSearchFromEnd ? cardsPile.cards.slice().reverse() : cardsPile.cards.slice();

      const firstDraggableCardIndex = searchStack.findIndex((card) => {
        return cards.includes(card);
      });

      console.log(
        'findCardsByCondition',
        cardsPile.cards.slice(isSearchFromEnd ? lastCardIndex - firstDraggableCardIndex : firstDraggableCardIndex),
      );
      return cardsPile.cards.slice(isSearchFromEnd ? lastCardIndex - firstDraggableCardIndex : firstDraggableCardIndex);
    }
  }

  private findCardsByPosition(position: Position, excludedCards: Card[] = []) {
    const condition = (card: Card): boolean => {
      return card.draggable && checkCardPosition(card, position) && !excludedCards.includes(card);
    };
    const isSearchFromEndOfPile = (pile: Pile) => {
      return true;
    };

    return this.findCardsByCondition(condition, isSearchFromEndOfPile);

    // const cards = this.cardDeckSorted.filter((card) => {
    //   return condition(card);
    // });
    //
    // if (cards && !!cards.length) {
    //   const cardsPile = cards[0].currentPile;
    //   const lastCardIndex = cardsPile.cards.length - 1;
    //
    //   const searchStack = isEqual(cardsPile.rootPosition, this.hand[1])
    //     ? cardsPile.cards.slice()
    //     : cardsPile.cards.slice().reverse();
    //
    //   const firstDraggableCardIndex = searchStack.findIndex((card) => {
    //     return cards.includes(card);
    //   });
    //
    //   return cardsPile.cards.slice(lastCardIndex - firstDraggableCardIndex);
    // }
  }

  private findSelectedCards(): Card[] | undefined {
    const condition = (card: Card): boolean => {
      return card.selected;
    };
    const isSearchFromEndOfPile = (pile: Pile) => {
      return isEqual(pile.rootPosition, this.hand[1].rootPosition);
    };

    return this.findCardsByCondition(condition, isSearchFromEndOfPile);

    // const cards = this.cardDeckSorted.filter((card) => {
    //   return card.selected;
    // });
    //
    // if (cards && !!cards.length) {
    //   const cardsPile = cards[0].currentPile;
    //
    //   const firstDraggableCardIndex = cardsPile.cards.slice().findIndex((card) => {
    //     return cards.includes(card);
    //   });
    //
    //   return cardsPile.cards.slice(firstDraggableCardIndex);
    // }
  }

  /** @deprecated (но это не точно) */
  private findCardByPosition(position: Position, excludedPile: Pile) {
    return this.cardDeckSorted.find((card) => {
      return (
        card.draggable &&
        checkCardPosition(card, position) &&
        !isEqual(card.currentPile.rootPosition, excludedPile.rootPosition)
      );
    });
  }

  private deleteCardsFromPile(cards: Card[], pile?: Pile, isOpenNewCard = false) {
    const cardsPile = pile ?? cards[0].currentPile;

    if (cardsPile) {
      cardsPile.cards = cardsPile.cards.filter((item) => !cards.includes(item));

      if (isOpenNewCard) {
        const lastPileCard = cardsPile.cards[cardsPile.cards.length - 1];
        lastPileCard && !lastPileCard.opened && openCard(lastPileCard);
      }

      this.rerenderPile(cardsPile);
    }
  }

  private prepareCardsForMove = (draggableCards: DraggableCards) => {
    /** Удаляем карту из текущей стопки на основном холсте
     * сама карта отрисовывается на холсте анимации
     * у карты остается ссылка на ту стопку, где она хранилась (currentPile) */
    const gameCanvasContext = getContextCanvas(this.gameCanvas);
    const animationCanvasContext = getContextCanvas(this.animationCanvas);

    clearDrawingCards(gameCanvasContext, draggableCards.cards);
    this.deleteCardsFromPile(draggableCards.cards);

    drawDraggableCards(animationCanvasContext, draggableCards);
  };

  private getDraggableCards = (cards: Card[]): DraggableCards => {
    return {
      cards,
      imageData: getCardsImageData(getContextCanvas(this.gameCanvas), cards),
      position: cards[0].currentPosition,
    };
  };

  private pileLastCardPosition(pile: Pile): Position {
    const isHandPile = checkPosition(pile.rootPosition, this.hand[1].rootPosition, this.cardOptions);

    return isHandPile ? this.hand[1].rootPosition : this.getTableauPileLastCardPosition(pile);
  }

  private putCardsToInitialPosition(draggableCards: DraggableCards): boolean {
    //console.log('putCardsToInitialPosition');
    const firstDraggableCard = draggableCards.cards[0];
    const pile = firstDraggableCard.currentPile;

    const cardNewPosition =
      pile.cards.find((item) => draggableCards.cards.includes(item))?.currentPosition ??
      this.pileLastCardPosition(pile);

    let selected = false;

    if (isEqual(firstDraggableCard.currentPosition, cardNewPosition)) {
      selected = true;
    }
    this.changeDraggableCardsPosition(draggableCards, cardNewPosition);
    //console.log(draggableCards, cardNewPosition);
    return selected;
  }

  private checkIsHandPileClick(position: Position) {
    const isHand_0 = checkPosition(position, this.hand[0].rootPosition, this.cardOptions);

    if (isHand_0) {
      this.onHandCardClick();
    }

    return isHand_0;
  }

  private onHandCardClick() {
    const closedHandPile = this.hand[0];
    const openedHandPile = this.hand[1];

    const currentCard = closedHandPile.cards.pop();
    const isEmptyHand = closedHandPile.cards.length === 0;

    if (currentCard) {
      openedHandPile.cards.push(currentCard);
      const endPosition = openedHandPile.rootPosition;

      currentCard.currentPile = openedHandPile;
      openCard(currentCard);

      this.changeCardsPosition(currentCard, null, endPosition);

      if (isEmptyHand) {
        this.rerenderPile(closedHandPile);
      }
    } else if (isEmptyHand) {
      closedHandPile.cards = openedHandPile.cards.reverse();
      closedHandPile.cards.forEach((card) => {
        card.currentPile = closedHandPile;
        card.currentPosition = closedHandPile.rootPosition;
        closeCard(card);
      });

      openedHandPile.cards = [];
      this.rerenderPile(openedHandPile);

      this.changeCardsPosition(closedHandPile.cards[0], openedHandPile.rootPosition, closedHandPile.rootPosition);
    }
    console.log('hand', this.hand);
  }

  private checkMovesCardToFoundationPile(draggableCards: DraggableCards, pile: Pile): Pile | undefined {
    if (!checkPilePosition(pile, this.foundations) || !draggableCards.cards.length || draggableCards.cards.length > 1) {
      return;
    }

    const draggableCard = draggableCards.cards[0];
    const draggableCardsPile = draggableCard.currentPile;

    const pileNextCard = pile.cards?.[pile.cards.length - 1]?.next;

    if ((!pileNextCard && draggableCard.rank === CardRank.ACE) || isEqual(pileNextCard, draggableCard)) {
      const changeCardPositionCallBack = (position: Position) => {
        this.deleteCardsFromPile(draggableCards.cards, draggableCardsPile, true);
      };

      this.changeDraggableCardsPosition(draggableCards, pile.rootPosition, changeCardPositionCallBack);

      return pile;
    }
  }

  private checkMovesCardToTableauPile(draggableCards: DraggableCards, pile: Pile): Pile | undefined {
    if (!checkPilePosition(pile, this.tableau)) {
      return;
    }
    const targetCard = pile.cards[pile.cards.length - 1];

    const draggableCard = draggableCards.cards[0];
    const draggableCardsPile = draggableCard.currentPile;

    if (isDraggableCardConditions(draggableCard, targetCard)) {
      const tableauPileLastCardPosition = this.getTableauPileLastCardPosition(pile);

      const changeCardPositionCallBack = (position: Position) => {
        this.deleteCardsFromPile(draggableCards.cards, draggableCardsPile, true);
      };

      this.changeDraggableCardsPosition(draggableCards, tableauPileLastCardPosition, changeCardPositionCallBack);

      return pile;
    }
  }

  private getTableauPileLastCardPosition(tableauPile: Pile): Position {
    const pileCardsCount = tableauPile.cards.length;

    return getTableauPileCardPosition(tableauPile.rootPosition, pileCardsCount, this.cardOptions);
  }

  /** MOVE CARDS */
  private moveCardsAcrossAnimationCanvas(draggableCards: DraggableCards, mousePosition: Position) {
    moveCards(this.animationCanvas, draggableCards, mousePosition);
  }

  private moveCardsToPile(draggableCards: DraggableCards, mousePosition: Position) {
    // const selectedCards = this.findSelectedCards();
    // if (
    //   selectedCards &&
    //   !!selectedCards.length &&
    //   !isEqual(selectedCards[0].currentPile.rootPosition, draggableCards.cards[0].currentPile.rootPosition)
    // ) {
    //   const draggableCardsPile = draggableCards.cards[0].currentPile;
    //   draggableCardsPile.cards = draggableCardsPile.cards.concat(draggableCards.cards);
    //
    //   this.renderPile(draggableCardsPile);
    //   draggableCards = this.getDraggableCards(selectedCards);
    //   this.prepareCardsForMove(draggableCards);
    // }

    const targetCard = this.findCardByPosition(mousePosition, draggableCards.cards[0].currentPile);
    const targetPile = targetCard?.currentPile ?? this.findPileByPosition(mousePosition);

    let cardsPile = draggableCards.cards[0].currentPile;

    const foundationPile = targetPile && this.checkMovesCardToFoundationPile(draggableCards, targetPile);
    const tableauPile = targetPile && this.checkMovesCardToTableauPile(draggableCards, targetPile);
    //console.log('moveCardsToPile', foundationPile, tableauPile);
    /*TODO много букв, нужен рефакторинг */
    if (foundationPile) {
      draggableCards.cards.forEach((card) => {
        card.currentPile = foundationPile;
        card.selected = false;
      });
      cardsPile = foundationPile;
      cardsPile.cards = cardsPile.cards.concat(draggableCards.cards);
    } else if (tableauPile) {
      draggableCards.cards.forEach((card) => {
        card.currentPile = tableauPile;
        card.selected = false;
      });
      cardsPile = tableauPile;
      cardsPile.cards = cardsPile.cards.concat(draggableCards.cards);
    } else {
      const selected = this.putCardsToInitialPosition(draggableCards);

      cardsPile.cards = cardsPile.cards.concat(draggableCards.cards);
      cardsPile.cards
        .filter((card) => {
          return card.draggable;
        })
        .forEach((card) => {
          card.selected = selected;
        });
    }

    this.checkPoints();
    this.checkLayout();
  }

  /** HANDLERS */
  private handleMouseDown(event: MouseEvent) {
    if (event.target !== this.animationCanvas) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const mousePosition = {x: event.offsetX, y: event.offsetY};

    if (!this.checkIsHandPileClick(mousePosition)) {
      const cards = this.findCardsByPosition(mousePosition);

      if (cards && !!cards.length) {
        this.draggableCards = this.getDraggableCards(cards);
        this.prepareCardsForMove(this.draggableCards);
      }
    }
  }

  handleMouseUp(event: MouseEvent) {
    if (event.target !== this.animationCanvas || !this.draggableCards) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    const {offsetX, offsetY} = event;

    this.moveCardsToPile(this.draggableCards, {x: offsetX, y: offsetY});
    this.draggableCards = undefined;
  }

  handleMouseMove(event: MouseEvent) {
    if (event.target !== this.animationCanvas || !this.draggableCards) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    this.moveCardsAcrossAnimationCanvas(this.draggableCards, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  private checkLayout() {
    if (
      this.isVisibleButtonCollect ||
      !!Object.values(this.hand).find((handPile) => handPile.cards.length !== 0) ||
      !!Object.values(this.tableau).find((tableauPile) => tableauPile.cards.find((card) => card.opened === false))
    ) {
      return;
    }

    this.isVisibleButtonCollect = true;

    const gameContext = getContextCanvas(this.gameCanvas);
    const button = drawCollectButton(gameContext, this.hand[1].rootPosition, this.pileMargin, this.cardOptions);

    const listener = (event: MouseEvent) => {
      if (event.target !== this.gameCanvas && !gameContext.isPointInPath(button, event.offsetX, event.offsetY)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      this.collectTableauPile();

      this.canvasContainer.removeEventListener('click', listener);
    };

    this.canvasContainer.addEventListener('click', listener);
  }

  /** points */
  private checkPoints() {
    let foundationsCardCount = 0;
    Object.values(this.foundations).forEach((pile) => {
      foundationsCardCount += pile.cards.length;
    });

    this.setPoints(foundationsCardCount * 15);

    if (foundationsCardCount === this.cardDeckSorted.length) {
      this.onGameOver(true);
    }
  }

  private onGameOver(isWin: boolean) {
    this.gameOverCallBack(isWin, this.points);
  }
}

export default GameEngine;
