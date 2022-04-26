import {
  BLACK_CARD_COLORS,
  Card,
  CardLeftUp,
  CardRank,
  CardRankValues,
  CardSuit,
  CardSuitValues,
  getStringKeys,
  Position,
} from '../../models/card.models';
import {TableauTree, TargetTree, Tree} from './types';
import shuffle from '../helpers/shuffle';
import {getPileStyle} from './game-elements.style';
import {isDraggableCardConditions, isDraggableCardToEmptyPileConditions} from './moving-card-conditions';
import {renderCard} from './card';

const backImagePath = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg';

class GameEngine {
  private gameCanvas: HTMLCanvasElement | undefined;
  private animationCanvas: HTMLCanvasElement | undefined;

  private isStarted = false;

  /** основная колода */
  private cardDeckSorted: Array<Card> = [];
  private cardDeck: Array<Card> = [];

  private startCardsPosition: CardLeftUp | undefined;

  /** хранение стопок карт, по принципу:
   * arr[0] - последняя карта в стопке
   * arr[arr.length - 1] - верхняя, открытая карта */

  /** Базы - верхние колоды разложенные по мастям */
  private foundations: {[p: string]: TargetTree} | undefined;
  private foundationsCount = 4;

  /** Основная часть раскладки пасьянса */
  private tableau: {[p: string]: TableauTree} | undefined;

  /** Кол-во стопок в раскладке */
  private tableauPilesCount = 7;

  /** Дополнительная колода в левом верхнем углу:
   * карты, оставшиеся после раскладывания пасьянса */
  private hand: {[p: string]: TargetTree} | undefined;
  private isEmptyHand = false;

  private cardWidth = 25;
  private cardHeight = 30;

  /** Oтступы между стопками карт */
  private pileMargin = 5;

  //рубашка
  private backImage: any;

  //класс контейнера с канвасами для их растягивания
  private canvasContainer: HTMLDivElement | undefined;

  private draggableCard: Card | undefined;

  private cardBorderSize = 3;

  public init(gameCanvas: HTMLCanvasElement, animationCanvas: HTMLCanvasElement, canvasContainer: HTMLDivElement) {
    this.gameCanvas = gameCanvas;
    this.animationCanvas = animationCanvas;
    this.canvasContainer = canvasContainer;
    this.resizeCanvas();
    //TODO при изменении размера окна в процессе анимации пол поля затирается
    // window.addEventListener('resize', () => {
    //   this.resizeCanvas();
    //   this.renderStartElements();
    // });

    const card: Card = {
      rank: CardRank.ACE,
      suit: CardSuit.SPADES,
      position: {x: 200, y: 200},
      draggable: false,
      opened: false,
      next: null,
      prev: null,
      options: {
        width: this.cardWidth,
        height: this.cardHeight,
      },
    };

    renderCard(this.animationCanvas, card);
  }

  private resizeCanvas() {
    if (this.canvasContainer) {
      const {width, height} = this.canvasContainer.getBoundingClientRect();
      this.gameCanvas!.width = width;
      this.gameCanvas!.height = height;
      this.animationCanvas!.width = width;
      this.animationCanvas!.height = height;
      //TODO Магические числа? Переприсваивается? Зачем тогда объявлять?
      this.cardWidth = width / 15;
      this.cardHeight = height / 5;
      this.pileMargin = width / 60;
    }
  }

  public renderStartElements() {
    this.isStarted = false;
    this.gameCanvas!.getContext('2d')!.clearRect(0, 0, this.gameCanvas!.width, this.gameCanvas!.height);
    this.animationCanvas!.getContext('2d')!.clearRect(0, 0, this.animationCanvas!.width, this.animationCanvas!.height);

    const image = new Image();
    image.src = backImagePath;
    image.width = this.cardWidth;
    image.height = this.cardHeight;
    this.backImage = image;
    image.addEventListener('load', () => {
      this.renderStartPilePosition();
      this.renderFoundations();
      this.renderHand();
      this.renderTableau();
    });
  }

  renderStartPilePosition() {
    const {width, height} = this.gameCanvas!;
    const point: CardLeftUp = {
      x: width / 2 - this.cardWidth / 2,
      y: height - this.pileMargin - this.cardHeight,
    };
    this.startCardsPosition = point;
    this.renderCard(this.gameCanvas!, point);
  }

  private renderCard(canvas: HTMLCanvasElement, point: CardLeftUp) {
    //TODO отрисовывать карту в том состоянии, в котором она находится
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.getImageStyles(ctx);
    ctx.drawImage(
      this.backImage,
      point.x,
      point.y,
      // this.cardWidth * window.devicePixelRatio,
      // this.cardHeight * window.devicePixelRatio,
      this.cardWidth,
      this.cardHeight,
    );
  }

  private cardShape(canvas: HTMLCanvasElement, card: Card, position: Position) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.getImageStyles(ctx); //TODO ?
    ctx.drawImage(this.backImage, position.x, position.y, card.options.width, card.options.height);
  }

  private getImageStyles(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }

  private renderElementPiles(
    element: Record<string, Tree> = {},
    coordX = 0,
    coordY = 0,
    pilesCount = 1,
    isRightMove = true,
  ): Record<string, Tree> {
    const sign = isRightMove ? 1 : -1;
    const ctx = getPileStyle(this.gameCanvas?.getContext('2d') as CanvasRenderingContext2D);

    for (let i = 0; i < pilesCount; i++) {
      coordX += sign * this.cardWidth;

      const point: CardLeftUp = {x: coordX, y: coordY};
      ctx.strokeRect(point.x, point.y, this.cardWidth, this.cardHeight);

      const position: Tree = {rootPosition: point};
      element = Object.assign(element, {[i]: position});

      coordX += sign * this.pileMargin * 2;
    }

    return element;
  }

  private renderFoundations() {
    const {width} = this.gameCanvas!;

    const coordX: number = width - this.pileMargin * 4;
    const coordY = this.pileMargin;

    this.foundations = this.renderElementPiles(this.foundations, coordX, coordY, this.foundationsCount, false);
  }

  renderTableau() {
    const {width} = this.gameCanvas!;

    const coordX: number = width - this.pileMargin * 4;
    const coordY = this.pileMargin * 2 + this.cardHeight;

    this.tableau = this.renderElementPiles(this.tableau, coordX, coordY, this.tableauPilesCount, false);
  }

  private renderHand() {
    const coordX: number = this.pileMargin * 6;
    const coordY = this.pileMargin;

    this.hand = this.renderElementPiles(this.hand, coordX, coordY, 2);
  }

  //TODO вынести в game-elements
  private getPileStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  public startGame() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.fillCardDeckSorted();
      this.shuffleCardDeck();
      this.fillTableauPile().then(() => {
        this.changeRemainStackPosition();
      });

      console.log('------------------');
      console.log('cardDeckSorted', this.cardDeckSorted);
      console.log('cardDeck', this.cardDeck);
      console.log('tableau', this.tableau);
      console.log('foundations', this.foundations);
      console.log('hand', this.hand);
    }
  }

  //Собираем полную колоду
  private fillCardDeckSorted() {
    const suitKeys = getStringKeys(CardSuit);
    const valueKeys = getStringKeys(CardRank);
    this.cardDeckSorted = suitKeys.reduce((result: Array<Card>, suit: unknown): Array<Card> => {
      let prevCard: Card | null = null;
      valueKeys.forEach((value: unknown) => {
        const newCard: Card = {
          rank: value as CardRank,
          suit: suit as CardSuit,
          position: null,
          draggable: false,
          opened: false,
          next: null,
          prev: prevCard,
        };
        if (prevCard) {
          prevCard.next = newCard;
        }
        result.push(newCard);
        prevCard = newCard;
      });
      return result;
    }, []);
  }

  private shuffleCardDeck() {
    this.cardDeck = shuffle(this.cardDeckSorted);
  }

  fillTableauPile(pileNumber = 0, success?: (value: PromiseLike<unknown> | unknown) => void) {
    return new Promise((resolve) => {
      if (pileNumber >= this.tableauPilesCount) {
        if (success) {
          return success('allIn');
        }
      }
      success = success || resolve;

      const currentTableauPile = this.tableau![this.tableauPilesCount - pileNumber - 1];

      //TODO вынести в инициализацию
      if (!currentTableauPile.cards) {
        currentTableauPile.cards = [];
      }

      const currentCard = this.getMovedCardFromDeck(currentTableauPile, pileNumber);

      const daftNewCard = () => {
        this.showCardFront(currentCard!);

        if ((currentTableauPile.cards?.length || 0) > pileNumber) {
          pileNumber++;
        }
        this.fillTableauPile(pileNumber, success);
      };

      currentCard?.position && this.changeCardPosition(currentCard.position, this.startCardsPosition!, daftNewCard);
    });
  }

  getMovedCardFromDeck(currentTableauPile: Tree, pileNumber: number) {
    const {rootPosition} = currentTableauPile;

    const cardNumber = currentTableauPile.cards?.length || 0;

    const currentCard = this.cardDeck.pop();

    const cardPosition: CardLeftUp = {
      x: rootPosition.x,
      y: rootPosition.y + cardNumber * this.pileMargin,
    };

    if (currentCard) {
      currentTableauPile.cards?.push(currentCard);
      currentCard.opened = cardNumber === pileNumber;
      currentCard.draggable = cardNumber === pileNumber;
      currentCard.position = cardPosition;
    }
    return currentCard;
  }

  showCardFront(card: Card) {
    if (card && card.opened) {
      const ctx = this.gameCanvas!.getContext('2d');
      if (ctx) {
        this.getRecaStyle(ctx);
        ctx.fillRect(card.position!.x, card.position!.y, this.cardWidth, this.cardHeight);
        ctx.strokeRect(card.position!.x, card.position!.y, this.cardWidth, this.cardHeight);
        this.getTextStyle(ctx, BLACK_CARD_COLORS.includes(card.suit));

        const suitName = CardSuitValues[card.suit];
        const rankName = CardRankValues[card.rank];

        const textCardMarginX = this.cardWidth / 5;
        const textCardMarginY = this.pileMargin;

        const textCardMaxWidth = this.cardWidth / 2;

        //верхний левый угол (T-top L-left)
        const textTLPosX: number = card.position!.x + textCardMarginX;
        const textTLPosY: number = card.position!.y + textCardMarginY;

        ctx.fillText(`${rankName}`, textTLPosX, textTLPosY, textCardMaxWidth);
        ctx.fillText(`${suitName}`, textTLPosX, textTLPosY + textCardMarginY, textCardMaxWidth);

        //нижний парвый угол
        const textBRPosX: number = card.position!.x + this.cardWidth - textCardMarginX;
        const textBRPosY: number = card.position!.y + this.cardHeight - textCardMarginY;

        ctx.save();
        ctx.rotate(Math.PI);

        ctx.fillText(`${rankName}`, -textBRPosX, -textBRPosY, textCardMaxWidth);
        ctx.fillText(`${suitName}`, -textBRPosX, -textBRPosY + textCardMarginY, textCardMaxWidth);

        ctx.restore();
      }
    }
  }

  private getRecaStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = this.cardBorderSize;
    ctx.fillStyle = 'white';
  }

  private getTextStyle(ctx: CanvasRenderingContext2D, isBlackColor = true) {
    ctx.fillStyle = isBlackColor ? '#000' : '#901414';
    ctx.font = 'bold 25px sans-serif';
    ctx.textAlign = 'center';
  }

  private changeCardPosition(end: CardLeftUp, startPos: CardLeftUp, callback?: () => void) {
    this.renderCard(this.animationCanvas!, startPos);
    const ctx = this.animationCanvas!.getContext('2d') as CanvasRenderingContext2D;

    const counter = 15;
    let count = 1;

    const deltaX = (end.x - startPos.x) / counter;
    const deltaY = (end.y - startPos.y) / counter;

    let currentPoint = startPos;
    let nextPoint;

    const step = () => {
      nextPoint = {x: startPos.x + deltaX * count, y: startPos.y + deltaY * count};
      if ((nextPoint.x >= end.x && deltaX > 0) || (nextPoint.x <= end.x && deltaX < 0)) {
        nextPoint = end;
      }
      ctx.clearRect(currentPoint.x, currentPoint.y, this.cardWidth + 1, this.cardHeight + 1);
      this.getImageStyles(ctx);
      ctx.drawImage(this.backImage, nextPoint.x, nextPoint.y, this.cardWidth, this.cardHeight);
      currentPoint = nextPoint;
      if (count <= counter) {
        count++;
        window.requestAnimationFrame(step);
      } else {
        this.renderCard(this.gameCanvas as HTMLCanvasElement, end);
        ctx.clearRect(0, 0, this.animationCanvas!.width, this.animationCanvas!.height);
        if (callback) {
          callback();
        }
      }
    };
    window.requestAnimationFrame(step);
  }

  private changeCardPositionNew(startPos: CardLeftUp, end: CardLeftUp, callback?: () => void) {
    debugger;
    this.renderCard(this.animationCanvas!, startPos);
    const ctx = this.animationCanvas!.getContext('2d') as CanvasRenderingContext2D;

    const counter = 15;
    let count = 1;

    const deltaX = (end.x - startPos.x) / counter;
    const deltaY = (end.y - startPos.y) / counter;

    let currentPoint = startPos;
    let nextPoint;

    const step = () => {
      nextPoint = {x: startPos.x + deltaX * count, y: startPos.y + deltaY * count};
      if ((nextPoint.x >= end.x && deltaX > 0) || (nextPoint.x <= end.x && deltaX < 0)) {
        nextPoint = end;
      }
      ctx.clearRect(currentPoint.x, currentPoint.y, this.cardWidth + 1, this.cardHeight + 1);
      this.getImageStyles(ctx);
      ctx.drawImage(this.backImage, nextPoint.x, nextPoint.y, this.cardWidth, this.cardHeight);
      currentPoint = nextPoint;
      if (count <= counter) {
        count++;
        window.requestAnimationFrame(step);
      } else {
        this.renderCard(this.gameCanvas as HTMLCanvasElement, end);
        ctx.clearRect(0, 0, this.animationCanvas!.width, this.animationCanvas!.height);
        if (callback) {
          callback();
        }
      }
    };
    window.requestAnimationFrame(step);
  }

  private moveCard(card: Card, targetPile: Tree, callback?: () => void) {
    if (card.position) {
      this.changeCardPositionNew(card.position, targetPile.rootPosition, () => {
        // this.draggableCard!.opened = true;
        // this.draggableCard!.position = endPosition;
        // this.showCardFront(this.draggableCard!);
      });
    }
  }

  changeRemainStackPosition() {
    this.clearCardsPosition(this.startCardsPosition!);
    const {rootPosition} = this.hand![0];
    this.changeCardPosition(rootPosition, this.startCardsPosition!);
    if (this.hand && this.hand[0]) {
      this.hand[0].cards = this.cardDeck;
      this.hand[0].cards!.forEach((card) => {
        if (this.hand && this.hand[0]) {
          card.position = this.hand[0].rootPosition;
        }
      });
    }

    document.addEventListener('mousedown', (event) => this.onCardClick(event));
    console.log('------------------');
    console.log('cardDeckSorted', this.cardDeckSorted);
    console.log('cardDeck', this.cardDeck);
    console.log('tableau', this.tableau);
    console.log('foundations', this.foundations);
    console.log('hand', this.hand);
  }

  clearCardsPosition(position: CardLeftUp) {
    const ctx = this.gameCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(
        position.x - this.cardBorderSize,
        position.y - this.cardBorderSize,
        this.cardWidth + 2 * this.cardBorderSize,
        this.cardHeight + 2 * this.cardBorderSize,
      );
    }
  }

  onCardClick(event: MouseEvent) {
    if (event.target === this.animationCanvas) {
      const {offsetX, offsetY} = event;

      const isHand_0 = this.hand && this.checkPosition(offsetX, offsetY, this.hand[0].rootPosition);
      const isHand_1 = this.hand && this.checkPosition(offsetX, offsetY, this.hand[1].rootPosition);

      if (isHand_0) {
        return this.onHandCardClick();
      }

      const currentFoundationPile = this.checkObjectPosition(offsetX, offsetY, this.foundations);

      if (currentFoundationPile) {
        this.putCardOnFoundation(offsetX, offsetY, currentFoundationPile);
      } else {
        const draggableTargetCard = this.findDraggableTargetCard(offsetX, offsetY);
        const currentTableauPile = this.checkObjectPosition(offsetX, offsetY, this.tableau);

        debugger;
        if (draggableTargetCard) {
          if (!this.draggableCard) {
            this.draggableCard = draggableTargetCard;
          } else {
            if (!isHand_1 && isDraggableCardConditions(this.draggableCard, draggableTargetCard)) {
              this.moveCardOnClick(draggableTargetCard);
            } else {
              this.draggableCard = draggableTargetCard;
            }
          }
        } else {
          if (
            currentTableauPile &&
            currentTableauPile.cards?.length === 0
            //&& isDraggableCardToEmptyPileConditions(this.draggableCard)
          ) {
            const endPosition = currentTableauPile.rootPosition;
            if (!!this.draggableCard && this.draggableCard.position) {
              this.moveCard(this.draggableCard, currentTableauPile);
            }
          }
        }
      }
    }
  }

  findDraggableTargetCard(offsetX: number, offsetY: number) {
    return this.cardDeckSorted.find((card) => {
      return card.draggable && this.checkPosition(offsetX, offsetY, card.position!);
    });
  }

  putCardOnFoundation(offsetX: number, offsetY: number, foundationPile: TargetTree | undefined) {
    if (this.foundations) {
      if (
        foundationPile &&
        this.draggableCard &&
        ((!foundationPile.nextCard && this.draggableCard.rank === CardRank.ACE) ||
          foundationPile.nextCard === this.draggableCard)
      ) {
        const stack = this.findCardStack(this.draggableCard);
        if (stack) {
          stack.cards = stack.cards!.filter((item) => item !== this.draggableCard!);
          this.renderPreviousCard(stack);
          this.changeCardPosition(foundationPile.rootPosition, this.draggableCard.position!, () => {
            this.draggableCard!.position! = foundationPile.rootPosition;
            foundationPile.nextCard = this.draggableCard?.next;
            this.showCardFront(this.draggableCard!);
            this.draggableCard = undefined;
          });
        }
      }
    }
  }

  checkPosition(offsetX: number, offsetY: number, point: CardLeftUp) {
    return (
      offsetX >= point.x &&
      offsetX <= point.x + this.cardWidth &&
      offsetY >= point.y &&
      offsetY <= point.y + this.cardHeight
    );
  }

  checkFoundationPosition(offsetX: number, offsetY: number) {
    if (this.foundations) {
      return Object.values(this.foundations).find((value): TargetTree | undefined => {
        if (this.checkPosition(offsetX, offsetY, value.rootPosition)) {
          return value;
        }
      });
    }
  }

  checkObjectPosition(offsetX: number, offsetY: number, obj?: Record<string, Tree>) {
    if (obj) {
      return Object.values(obj).find((value) => {
        if (value && this.checkPosition(offsetX, offsetY, value.rootPosition)) {
          return value;
        }
      });
    }
  }

  onHandCardClick() {
    if (this.hand && this.hand[1] && this.hand[0]) {
      const currentCard = this.hand[0].cards!.pop();
      this.hand[1].cards = this.hand[1]!.cards || [];

      this.checkIsEmptyHand();

      if (currentCard) {
        this.hand[1].cards?.push(currentCard);
        const endPosition = this.hand[1].rootPosition;
        this.changeCardPosition(endPosition, currentCard.position!, () => {
          currentCard.opened = true;
          currentCard.position = endPosition;
          this.changeDraggableHandCards();
          this.showCardFront(currentCard);
        });
      } else if (this.isEmptyHand) {
        this.hand[0].cards = this.hand[1].cards.reverse();
        this.hand[0].cards[0].draggable = false;
        this.hand[1].cards = [];
        this.renderHandEmpty(this.hand[1].rootPosition);
        this.changeCardPosition(this.hand[0].rootPosition, this.hand[1].rootPosition, () => {
          this.isEmptyHand = false;
        });
      }
    }
  }

  /** в открытой колоде доступна для перемещения только верхняя карта */
  changeDraggableHandCards() {
    this.hand &&
      this.hand[1].cards?.forEach((card, index, array) => {
        card.draggable = ++index === array.length;
      });
  }

  checkIsEmptyHand() {
    if (this.hand && this.hand[0].cards?.length === 0) {
      this.isEmptyHand = true;
      this.renderHandEmpty(this.hand[0].rootPosition);
    }
  }

  moveCardOnClick(draggableTargetCard: Card) {
    const newStack = this.findCardStack(draggableTargetCard);
    const stack = this.findCardStack(this.draggableCard!);
    if (stack && stack.cards && newStack && newStack.cards) {
      stack.cards = stack.cards.filter((item) => item !== this.draggableCard!);
      if (!stack.cards.length) {
        this.renderHandEmpty(stack.rootPosition);
      } else {
        this.renderPreviousCard(stack);
      }
      if (draggableTargetCard.position) {
        const newPosition = {
          x: draggableTargetCard.position.x,
          y: draggableTargetCard.position.y + this.pileMargin * 2,
        };
        this.draggableCard!.position = newPosition;
        this.changeCardPosition(newPosition, this.draggableCard!.position!, () => {
          this.showCardFront(this.draggableCard!);
          newStack.cards!.forEach((item) => {
            item.draggable = false;
          });
          newStack.cards!.push(this.draggableCard!);
          this.draggableCard = undefined;
        });
      }
    }
  }

  renderPreviousCard(stack: Tree) {
    if (Array.isArray(stack.cards) && stack.cards.length !== 0) {
      const lastCard = stack.cards[stack.cards.length - 1];
      lastCard.opened = true;
      lastCard.draggable = true;
      this.clearCardsPosition(this.draggableCard!.position!);
      this.renderCard(this.gameCanvas!, lastCard.position!);
      this.showCardFront(lastCard);
    }
  }

  findCardStack(card: Card): Tree | undefined {
    let result;
    Object.entries(this.tableau!).forEach(([key, value]) => {
      if (value.cards!.includes(card)) {
        result = this.tableau![key];
        return;
      }
    });
    if (!result) {
      Object.entries(this.hand!).forEach(([key, value]) => {
        if (value.cards!.includes(card)) {
          result = this.hand![key];
          return;
        }
      });
    }
    return result;
  }

  renderHandEmpty(start: CardLeftUp) {
    const ctx = this.gameCanvas!.getContext('2d');
    if (ctx) {
      ctx.clearRect(start.x, start.y, this.cardWidth, this.cardHeight);
      this.getPileStyle(ctx);
      ctx.strokeRect(start.x, start.y, this.cardWidth, this.cardHeight);
    }
  }
}

export default new GameEngine();
