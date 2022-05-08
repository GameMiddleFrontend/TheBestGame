import {getContextCanvas} from './canvas/canvas.util';
import {
  MIN_PILE_MARGIN,
  MIN_CARD_HEIGHT,
  MIN_CARD_WIDTH,
  getCardWidthByHeight,
  Options,
  Position,
  getPileMarginByCardHeight,
  FoundationPile,
  Pile,
  PilesElement,
  initialPilesElement,
  FOUNDATIONS_PILES_COUNT,
  HandPile,
  HAND_PILES_COUNT,
  TableauPile,
  TABLEAU_PILES_COUNT,
  Area,
  initialPilesArea,
  initialPosition,
  MIN_OFFSET_IN_PILE,
  getOffsetInPileByHeight,
} from './solitaire.types';
import {
  checkCardPosition,
  clearDrawingCard,
  clearDrawingCardFromPile,
  drawCard,
  moveCards,
  openCard,
} from './card/card';
import {Card} from './card/card.types';
import {clearSelectedCards, drawElementPile, drawSelectedCards} from './solitaire.draw-elements';
import {getCardDeck} from './solitaire.utils';
import shuffle from '../helpers/shuffle';
import isEqual from '../helpers/isEqual';

class GameEngine {
  private static _instance: GameEngine;

  private readonly gameCanvas: HTMLCanvasElement;
  private readonly animationCanvas: HTMLCanvasElement;

  /** Класс контейнера с канвасами */
  private readonly canvasContainer: HTMLDivElement;

  /** Основное поле размещения стопок карт */
  private pilesArea: Area = initialPilesArea;

  private isStarted = false;
  private draggableCards: Card | undefined;
  private selectedCards: Card | Card[] | undefined;

  /** основная колода */
  private readonly cardDeckSorted: Array<Card> = [];
  private cardDeck: Array<Card> = [];

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

  /** Базы - верхние колоды разложенные по мастям */
  private foundations: PilesElement<FoundationPile> = initialPilesElement;

  /** Основная часть раскладки пасьянса */
  private tableau: PilesElement<TableauPile> = initialPilesElement;

  /** Дополнительная колода в левом верхнем углу:
   * карты, оставшиеся после раскладывания пасьянса */
  private hand: PilesElement<HandPile> = initialPilesElement;

  constructor(gameCanvas: HTMLCanvasElement, animationCanvas: HTMLCanvasElement, canvasContainer: HTMLDivElement) {
    this.gameCanvas = gameCanvas;
    this.animationCanvas = animationCanvas;
    this.canvasContainer = canvasContainer;

    this.resizeCanvas();

    this.cardDeckSorted = getCardDeck(this.cardOptions, this.startPilePosition);

    if (GameEngine._instance) {
      return GameEngine._instance;
    }

    GameEngine._instance = this;
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

  public renderStartElements() {
    this.isStarted = false;

    getContextCanvas(this.gameCanvas).clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    getContextCanvas(this.animationCanvas).clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);

    this.renderStartGamePosition();
  }

  public startGame() {
    if (!this.isStarted) {
      this.isStarted = true;

      this.cardDeck = shuffle(this.cardDeckSorted);

      this.fillTableauPile().then(() => {
        this.changeRemainStackPosition();

        this.canvasContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvasContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvasContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvasContainer.addEventListener('mouseout', this.handleMouseUp.bind(this));
      });

      console.log('------------------');
      console.log('cardDeck', this.cardDeck);
      console.log('tableau', this.tableau);
      console.log('foundations', this.foundations);
      console.log('hand', this.hand);
    }
  }

  renderStartGamePosition() {
    this.renderFoundations();
    this.renderHand();
    this.renderTableau();

    this.startPilePosition = {
      x: this.pilesArea.x + this.pilesArea.width / 2 - this.cardOptions.width / 2,
      y: this.pilesArea.y + this.pilesArea.height - this.cardOptions.height,
    };

    const firstCard = {...this.cardDeckSorted[0], opened: false};

    //Имитируем колоду карт
    drawCard(getContextCanvas(this.gameCanvas), firstCard, this.startPilePosition);
  }

  /** PILES */
  private getElementPile<T extends Pile = Pile>(
    element: Record<number, T> = {},
    coordX = 0,
    coordY = 0,
    pilesCount = 1,
    isRightMove = true,
  ): Record<number, T> {
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

    this.foundations = this.getElementPile<FoundationPile>(
      {...this.foundations},
      coordX,
      coordY,
      FOUNDATIONS_PILES_COUNT,
    );
    drawElementPile(getContextCanvas(this.gameCanvas), this.foundations, this.cardOptions);
  }

  private renderHand() {
    const coordX: number = this.pilesArea.x;
    const coordY = this.pileMargin;

    this.hand = this.getElementPile<HandPile>({...this.hand}, coordX, coordY, HAND_PILES_COUNT);
    drawElementPile(getContextCanvas(this.gameCanvas), this.hand, this.cardOptions);
  }

  private renderTableau() {
    const coordX: number = this.pilesArea.x;
    const coordY = this.pilesArea.y + this.cardOptions.height + this.cardOptions.height / 2;

    this.tableau = this.getElementPile<TableauPile>({...this.tableau}, coordX, coordY, TABLEAU_PILES_COUNT);
    drawElementPile(getContextCanvas(this.gameCanvas), this.tableau, this.cardOptions);
  }

  private rerenderPile(pile: Pile) {
    if (Array.isArray(pile.cards) && pile.cards.length !== 0) {
      const lastPileCard = pile.cards[pile.cards.length - 1];

      drawCard(getContextCanvas(this.gameCanvas), lastPileCard);
    }
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
        this.changeCardPosition(currentCard, this.startPilePosition, currentCard.currentPosition, daftNewCard);
    });
  }

  private renderPile(pile: Pile) {
    if (pile.cards.length !== 0) {
      const lastPileCard = pile.cards[pile.cards.length - 1];

      drawCard(getContextCanvas(this.gameCanvas), lastPileCard);
    }
  }

  /** CARDS */
  getCardFromDeck(currentTableauPile: TableauPile, pileNumber: number) {
    const {rootPosition} = currentTableauPile;

    const cardNumber = currentTableauPile.cards.length;

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

  private changeCardPosition(
    card: Card,
    startPos: Position | null,
    endPos: Position,
    callback?: (position: Position) => void,
  ) {
    const ctx = getContextCanvas(this.animationCanvas);

    const startCardPosition = startPos ?? card.currentPosition;
    drawCard(ctx, card, startCardPosition);

    const counter = 15;
    let count = 1;

    const deltaX = (endPos.x - startCardPosition.x) / counter;
    const deltaY = (endPos.y - startCardPosition.y) / counter;

    let currentPoint = startCardPosition;
    let nextPoint;

    const step = () => {
      nextPoint = {x: startCardPosition.x + deltaX * count, y: startCardPosition.y + deltaY * count};
      if ((nextPoint.x >= endPos.x && deltaX > 0) || (nextPoint.x <= endPos.x && deltaX < 0)) {
        nextPoint = endPos;
      }
      ctx.clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);
      drawCard(ctx, card, nextPoint);

      currentPoint = nextPoint;
      if (count <= counter) {
        count++;
        window.requestAnimationFrame(step);
      } else {
        drawCard(getContextCanvas(this.gameCanvas), card, endPos);
        ctx.clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);

        if (callback) {
          callback(endPos);
        }
      }
    };

    window.requestAnimationFrame(step);
  }

  changeRemainStackPosition() {
    const {rootPosition} = this.hand[0];

    clearDrawingCard(getContextCanvas(this.gameCanvas), this.cardDeck[0], this.startPilePosition);

    this.hand[0].cards = this.cardDeck;
    this.hand[0].cards.forEach((card: Card) => {
      this.changeCardPosition(card, this.startPilePosition, rootPosition);
    });
    this.cardDeck = [];
  }

  private findCardByPosition(position: Position, excludedCards: Card[] = []) {
    return this.cardDeckSorted.find((card) => {
      return card.draggable && checkCardPosition(card, position) && !excludedCards.includes(card);
    });
  }

  private findSelectedCards(): Card | undefined {
    /*TODO искать все выделенные карты*/
    return this.cardDeckSorted.find((card) => {
      return card.selected;
    });
  }

  private deleteCardFromPile(card: Card) {
    const cardPile = card.currentPile;

    if (cardPile) {
      cardPile.cards = cardPile.cards.filter((item) => item !== card);
      this.rerenderPile(cardPile);
    }
  }

  private prepareCardsForMove = (cards: Card | Card[]) => {
    /** Удаляем карту из текущей стопки на основном холсте
     * ререндерим стопку карт,
     * сама карта отрисовывается на холсте анимации
     * у карты остается ссылка на ту стопку, где она хранилась (currentPile) */
    if (cards) {
      const gameCanvasContext = getContextCanvas(this.gameCanvas);
      const animationCanvasContext = getContextCanvas(this.animationCanvas);

      clearDrawingCardFromPile(gameCanvasContext, cards, this.deleteCardFromPile.bind(this));
      drawCard(animationCanvasContext, cards);
    }
  };

  // private selectCards = (cards: Card | Card[]) => {
  //   if (cards) {
  //     this.selectedCards = cards;
  //   }
  // };
  //
  // private unselectCards = (cards: Card | Card[]) => {
  //   /** Снимаем выделение с карт, и нужно их вернуть в стопку и отрисовать заново на gameCanvas */
  //   if (cards) {
  //     clearSelectedCards(getContextCanvas(this.animationCanvas), cards, this.offsetInPile);
  //     drawCard(getContextCanvas(this.gameCanvas), Array.isArray(cards) ? cards[0] : cards);
  //
  //     console.log('unselectCards', cards);
  //     this.selectedCards = undefined;
  //   }
  // };

  putCardToInitialPosition(draggableCard: Card) {
    // const pileLastCardIndex = draggableCard.currentPile.cards.length - 1;
    // const lastCardInPile = draggableCard.currentPile.cards[pileLastCardIndex];
    //
    // if (lastCardInPile && lastCardInPile === draggableCard) {
    //    draggableCard.currentPile.cards.pop();
    // }

    const cardPosition = this.getTableauPileLastCardPosition(draggableCard.currentPile);
    if (!isEqual(cardPosition, draggableCard.currentPosition)) {
      this.changeCardPosition(draggableCard, draggableCard.currentPosition, cardPosition);
      draggableCard.selected = false;
    } else {
      draggableCard.selected = true;
    }
  }

  private moveCardsAcrossAnimationCanvas(draggableCards: Card | Cards[], mousePosition: Position) {
    moveCards(this.animationCanvas, draggableCards, mousePosition);
  }

  private moveCardsToPile(draggableCard: Card, mousePosition: Position) {
    const selectedCards = this.findSelectedCards();

    if (selectedCards && selectedCards !== draggableCard) {
      draggableCard.currentPile.cards.push(draggableCard);
      this.renderPile(draggableCard.currentPile);
      draggableCard = selectedCards;
    }

    const targetCard = this.findCardByPosition(mousePosition);
    debugger;
    let cardPile = draggableCard.currentPile;
    /*TODO проверять сразу по targetCard */
    const tableauPile = this.checkMovesCardToTableauPile(draggableCard, mousePosition);

    if (tableauPile) {
      draggableCard.currentPile = tableauPile;
      draggableCard.selected = false;
      cardPile = tableauPile;
    } else {
      debugger;
      this.putCardToInitialPosition(draggableCard);
    }

    cardPile.cards.push(draggableCard);
    console.log('moveCardToPile draggableCard', draggableCard);
    console.log('moveCardToPile cardPile', cardPile);
  }

  private checkMovesCardToTableauPile(draggableCard: Card, mousePosition: Position): TableauPile | undefined {
    /* TODO нужно искать полностью стопку, а не нажатую карту */
    const targetCard = this.findCardByPosition(mousePosition, [draggableCard]);

    if (targetCard && targetCard !== draggableCard /*&& isDraggableCardConditions(draggableCard, targetCard)*/) {
      // const tableauPile = this.findCardPile(targetCard);
      const tableauPile = targetCard.currentPile;
      tableauPile && this.putCardOnTableau(draggableCard, tableauPile, mousePosition);
      return tableauPile;
    }
  }

  private putCardOnTableau(draggableCard: Card, tableauPile: TableauPile, mousePosition: Position) {
    const cardPile = draggableCard.currentPile;
    const tableauPileLastCardPosition = this.getTableauPileLastCardPosition(tableauPile);

    const changeCardPositionCallBack = (position: Position) => {
      if (cardPile) {
        cardPile.cards = cardPile.cards.filter((item) => item !== draggableCard);
        const lastPileCard = cardPile.cards[cardPile.cards.length - 1];

        lastPileCard && openCard(lastPileCard);
        this.renderPile(cardPile);
      }
    };

    this.changeCardPosition(draggableCard, null, tableauPileLastCardPosition, changeCardPositionCallBack);
  }

  private getTableauPileLastCardPosition(tableauPile: TableauPile): Position {
    const pileCardsCount = tableauPile.cards.length;

    return {
      x: tableauPile.rootPosition.x,
      y: tableauPile.rootPosition.y + pileCardsCount * this.offsetInPile,
    };
  }

  private findCardPile(card: Card): Pile | undefined {
    /*TODO рефакторинг*/
    let result;
    // console.log('findCardPile card', card);
    Object.entries(this.tableau).forEach(([key, value]) => {
      // console.log('findCardPile tableau', this.tableau, value);
      if ((value.cards || []).includes(card)) {
        result = this.tableau[key];
        return;
      }
    });
    if (!result) {
      Object.entries(this.hand).forEach(([key, value]) => {
        // console.log('findCardPile hand', this.hand, value);
        if ((value.cards || []).includes(card)) {
          result = this.hand[key];
          return;
        }
      });
    }
    return result;
  }

  private handleMouseDown(event: MouseEvent) {
    if (event.target === this.animationCanvas) {
      event.preventDefault();
      event.stopPropagation();

      const {offsetX, offsetY} = event;

      this.draggableCards = this.findCardByPosition({x: offsetX, y: offsetY});
      if (this.draggableCards) {
        //this.draggableCards.selected = true;
        this.prepareCardsForMove(this.draggableCards);
      }

      // const card = this.findCardByPosition({x: offsetX, y: offsetY});
      // this.selectedCards = card;
      //
      // debugger;
      // if (card) {
      //   if (!this.draggableCards) {
      //     this.draggableCards = card;
      //   }
      //
      //   if (this.draggableCards) {
      //     this.draggableCards.selected = true;
      //     this.prepareCardsForMove(this.draggableCards);
      //   }
      // }
    }
    console.log('handleMouseDown', this.draggableCards, this.selectedCards);
  }

  handleMouseUp(event: MouseEvent) {
    if (event.target === this.animationCanvas) {
      if (!this.draggableCards) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const {offsetX, offsetY} = event;

      //let selectedCard = this.draggableCards;
      this.moveCardsToPile(this.draggableCards, {x: offsetX, y: offsetY});

      //if (this.draggableCards !== this.selectedCards) {
      this.draggableCards = undefined;
      //}

      // if (this.selectedCards) {
      //   if (this.selectedCards !== this.draggableCards) {
      //     //movedCards = this.selectedCards;
      //     this.moveCardToPile(this.selectedCards, {x: offsetX, y: offsetY});
      //     //   this.moveCardToPile(this.selectedCards, {x: offsetX, y: offsetY});
      //     //   //this.unselectCards(this.selectedCards);
      //   } else {
      //     this.moveCardToPile(this.selectedCards, {x: offsetX, y: offsetY});
      //   }
      // } else {
      //   //this.moveCardToPile(this.draggableCards, {x: offsetX, y: offsetY});
      //   this.selectCards(this.draggableCards);
      //   this.moveCardToPile(this.draggableCards, {x: offsetX, y: offsetY});
      // }

      //this.unselectCards();

      // clearSelectedCards(getContextCanvas(this.animationCanvas), this.draggableCard, this.offsetInPile);
      // drawCard(
      //   getContextCanvas(this.gameCanvas),
      //   Array.isArray(this.draggableCard) ? this.draggableCard[0] : this.draggableCard,
      // );
      // this.draggableCard = undefined;
    }
  }

  handleMouseMove(event: MouseEvent) {
    if (!this.draggableCards) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.moveCardsAcrossAnimationCanvas(this.draggableCards, {x: event.clientX, y: event.clientY});
  }
}

export default GameEngine;
