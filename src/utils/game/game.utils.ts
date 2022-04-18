import {Card, CardLeftUp, CardSuit, CardValue, getStringKeys} from '../../models/game.models';
import {SecondaryTree, TargetTree, Tree} from './types';

const backImagePath = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg';

class GameEngine {
  private gameCanvas: HTMLCanvasElement | undefined;

  private animationCanvas: HTMLCanvasElement | undefined;

  private isStarted = false;

  //колода
  private cardStack: Array<Card> = [];

  //колода в additionalCard
  private shortCardStack: Array<Card> = [];

  private startCardsPosition: CardLeftUp | undefined;

  //верхние стопки с мастями
  private targetStrokes: {[p: string]: TargetTree} | undefined;

  //нижние стопки с картами в игре
  private secondaryStrokes: {[p: string]: SecondaryTree} | undefined;

  //дополнительная колода в левом верхнем углу
  private additionalCard: {[p: string]: TargetTree} | undefined;

  private cardWidth = 25;

  private cardHeight = 30;

  //отступы от карт
  private targetStackMargin = 5;

  //кол-во стопок вигре
  private secondaryStackCount = 7;

  private targetStackPositions: Array<number> = [];

  //рубашка
  private backImage: any;

  //класс контейнера с канвасами для их растягивания
  private containerClass = '';

  private isEmptyAdditional = false;

  private draggableCard: Card | undefined;

  private cardBoderSize = 3;

  public init(gameCanvas: HTMLCanvasElement, animationCanvas: HTMLCanvasElement, containerClass: string) {
    this.gameCanvas = gameCanvas;
    this.animationCanvas = animationCanvas;
    this.containerClass = containerClass;
    this.resizeCanvas();
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.renderStartElements();
    });
  }

  private resizeCanvas() {
    const container = document.querySelector(`.${this.containerClass}`);
    if (container) {
      const {width, height} = container.getBoundingClientRect();
      this.gameCanvas!.width = width;
      this.gameCanvas!.height = height;
      this.animationCanvas!.width = width;
      this.animationCanvas!.height = height;
      this.cardWidth = width / 15;
      this.cardHeight = height / 5;
      this.targetStackMargin = width / 60;
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
      this.renderStartStackPosition();
      this.renderTargetStrokes();
      this.renderAdditionalStack();
      this.renderStrokes();
    });
  }

  renderStartStackPosition() {
    const {width, height} = this.gameCanvas!;
    const point: CardLeftUp = {x: width / 2 - this.cardWidth / 2, y: height - this.targetStackMargin - this.cardHeight};
    this.startCardsPosition = point;
    this.renderCard(this.gameCanvas!, point);
  }

  private renderCard(canvas: HTMLCanvasElement, point: CardLeftUp) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.getImageStyles(ctx);
    ctx.drawImage(
      this.backImage,
      point.x,
      point.y,
      this.cardWidth * window.devicePixelRatio,
      this.cardHeight * window.devicePixelRatio,
    );
  }

  private getImageStyles(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }

  private renderTargetStrokes() {
    this.targetStrokes = undefined;
    const {width} = this.gameCanvas!;
    const ctx = this.gameCanvas?.getContext('2d') as CanvasRenderingContext2D;
    this.getStrokeStyle(ctx);
    let cardX: number = width - 4 * this.targetStackMargin;
    for (let i = 0; i < 4; i++) {
      cardX -= this.cardWidth;
      const point: CardLeftUp = {x: cardX, y: this.targetStackMargin};
      ctx.strokeRect(point.x, point.y, this.cardWidth, this.cardHeight);
      const position: TargetTree = {rootPosition: point};
      this.targetStrokes = Object.assign(this.targetStrokes || {}, {[CardSuit[i]]: position});
      this.targetStackPositions.push(cardX);
      cardX -= 2 * this.targetStackMargin;
    }
  }

  renderStrokes() {
    this.secondaryStrokes = undefined;
    const {width} = this.gameCanvas!;
    const ctx = this.gameCanvas?.getContext('2d') as CanvasRenderingContext2D;
    this.getStrokeStyle(ctx);
    const secondFloorCoord = 2 * this.targetStackMargin + this.cardHeight;
    let cardX: number = width - 4 * this.targetStackMargin;
    for (let i = 0; i < this.secondaryStackCount; i++) {
      cardX -= this.cardWidth;
      const point: CardLeftUp = {x: cardX, y: secondFloorCoord};
      ctx.strokeRect(point.x, point.y, this.cardWidth, this.cardHeight);
      const position: SecondaryTree = {rootPosition: point};
      this.secondaryStrokes = Object.assign(this.secondaryStrokes || {}, {[i]: position});
      this.targetStackPositions.push(cardX);
      cardX -= 2 * this.targetStackMargin;
    }
  }

  private renderAdditionalStack() {
    const ctx = this.gameCanvas?.getContext('2d') as CanvasRenderingContext2D;
    this.getStrokeStyle(ctx);
    let x = 6 * this.targetStackMargin;
    let point: CardLeftUp = {x, y: this.targetStackMargin};
    ctx.strokeRect(point.x, point.y, this.cardWidth, this.cardHeight);
    let position: TargetTree = {rootPosition: point};
    this.additionalCard = Object.assign({}, {0: position});
    x += this.cardWidth + 2 * this.targetStackMargin;
    point = {x, y: this.targetStackMargin};
    ctx.strokeRect(point.x, point.y, this.cardWidth, this.cardHeight);
    position = {rootPosition: point};
    this.additionalCard[1] = position;
  }

  private getStrokeStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  public startGame() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.fillStack();
      this.changeCardStackPlaces();
      this.fillSecondaryStacks(0, 0).then(() => {
        this.changeRemainStackPosition();
      });
    }
  }

  private fillStack() {
    const suitKeys = getStringKeys(CardSuit);
    const valueKeys = getStringKeys(CardValue);
    this.cardStack = suitKeys.reduce((result: Array<Card>, suit: unknown): Array<Card> => {
      let prevCard: Card | null = null;
      valueKeys.forEach((value: unknown) => {
        const newCard: Card = {
          value: value as CardValue,
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
        if (value === CardValue[CardValue.Ace]) {
          this.targetStrokes![suit as string].nextCard = newCard;
        }
        prevCard = newCard;
      });
      return result;
    }, []);
  }

  private changeCardStackPlaces() {
    this.shortCardStack = this.cardStack.slice();
    for (let i = this.shortCardStack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.shortCardStack[i];
      this.shortCardStack[i] = this.shortCardStack[j];
      this.shortCardStack[j] = temp;
    }
  }

  fillSecondaryStacks(
    stackNumber: number,
    cardNumber: number,
    success?: (value: PromiseLike<unknown> | unknown) => void,
  ) {
    return new Promise((resolve) => {
      if (stackNumber >= this.secondaryStackCount) {
        if (success) {
          return success('allIn');
        }
      }
      success = success || resolve;
      const currentSecondaryStack = this.secondaryStrokes![this.secondaryStackCount - stackNumber - 1];
      const currentCard = this.shortCardStack.pop();
      if (!currentSecondaryStack.cards) {
        currentSecondaryStack.cards = [];
      }
      const {rootPosition} = currentSecondaryStack;
      const endPosition: CardLeftUp = {x: rootPosition.x, y: rootPosition.y + cardNumber * this.targetStackMargin};
      if (currentCard) {
        currentSecondaryStack.cards?.push(currentCard);
        currentCard.opened = cardNumber === stackNumber;
        currentCard.draggable = cardNumber === stackNumber;
        currentCard.position = endPosition;
      }
      const callback = () => {
        this.showCardFront(currentCard!);
        cardNumber++;
        if (cardNumber > stackNumber) {
          stackNumber++;
          cardNumber = 0;
        }
        this.fillSecondaryStacks(stackNumber, cardNumber, success);
      };
      this.changeCardPosition(endPosition, this.startCardsPosition!, callback);
    });
  }

  showCardFront(card: Card) {
    if (card && card.opened) {
      const ctx = this.gameCanvas!.getContext('2d');
      if (ctx) {
        this.getRecaStyle(ctx);
        ctx.fillRect(card.position!.x, card.position!.y, this.cardWidth, this.cardHeight);
        ctx.strokeRect(card.position!.x, card.position!.y, this.cardWidth, this.cardHeight);
        this.getTextStyle(ctx);
        const textMargin = 1.5 * this.targetStackMargin;
        const xPos: number = card.position!.x + this.targetStackMargin / 2 + textMargin;
        const yPos: number = card.position!.y + this.targetStackMargin / 2 + textMargin;
        const suitName: string = card.suit as unknown as string;
        ctx.fillText(suitName, xPos, yPos, this.cardWidth - 2 * this.targetStackMargin);
        const valueName = card.value as unknown as string;
        ctx.fillText(valueName, xPos, yPos + textMargin, this.cardWidth - 2 * this.targetStackMargin);
      }
    }
  }

  private getRecaStyle(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = this.cardBoderSize;
    ctx.fillStyle = 'white';
  }

  private getTextStyle(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 30px sans-serif';
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

  changeRemainStackPosition() {
    this.clearCardsPosition(this.startCardsPosition!);
    const {rootPosition} = this.additionalCard![0];
    this.changeCardPosition(rootPosition, this.startCardsPosition!);
    if (this.additionalCard && this.additionalCard[0]) {
      this.additionalCard[0].cards = this.shortCardStack;
      this.additionalCard[0].cards!.forEach((card) => {
        if (this.additionalCard && this.additionalCard[0]) {
          card.position = this.additionalCard[0].rootPosition;
        }
      });
    }
    document.addEventListener('mousedown', (event) => this.onClick(event));
    console.log('------------------');
    console.log(this.cardStack);
    console.log(this.shortCardStack);
    console.log(this.secondaryStrokes);
    console.log(this.targetStrokes);
    console.log(this.additionalCard);
  }

  clearCardsPosition(position: CardLeftUp) {
    const ctx = this.gameCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(
        position.x - this.cardBoderSize,
        position.y - this.cardBoderSize,
        this.cardWidth + 2 * this.cardBoderSize,
        this.cardHeight + 2 * this.cardBoderSize,
      );
    }
  }

  onClick(event: MouseEvent) {
    if (event.target === this.animationCanvas) {
      const {offsetX, offsetY} = event;
      if (this.additionalCard && this.checkPosition(offsetX, offsetY, this.additionalCard[0].rootPosition)) {
        return this.onAdditionalCardClick();
      }
      const draggableTargetCard = this.findDraggableTargetCard(offsetX, offsetY);
      if (draggableTargetCard) {
        if (!this.draggableCard) {
          this.draggableCard = draggableTargetCard;
        } else {
          if (draggableTargetCard !== this.draggableCard) {
            this.moveCardOnClick(draggableTargetCard);
          } else {
            this.draggableCard = draggableTargetCard;
          }
        }
      }
      this.putCardOnTarget(offsetX, offsetY);
    }
  }

  findDraggableTargetCard(offsetX: number, offsetY: number) {
    return this.cardStack.find((card) => {
      return card.draggable && this.checkPosition(offsetX, offsetY, card.position!);
    });
  }

  putCardOnTarget(offsetX: number, offsetY: number) {
    if (this.targetStrokes) {
      const targetStroke: TargetTree | undefined = Object.values(this.targetStrokes).find(
        (value): TargetTree | undefined => {
          if (this.checkPosition(offsetX, offsetY, value.rootPosition)) {
            return value;
          }
        },
      );
      if (targetStroke && this.draggableCard && targetStroke.nextCard === this.draggableCard) {
        const stack = this.findCardStack(this.draggableCard);
        if (stack) {
          stack.cards = stack.cards!.filter((item) => item !== this.draggableCard!);
          this.renderPreviousCard(stack);
          this.changeCardPosition(targetStroke.rootPosition, this.draggableCard.position!, () => {
            this.draggableCard!.position! = targetStroke.rootPosition;
            targetStroke.nextCard = this.draggableCard?.next;
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

  onAdditionalCardClick() {
    if (this.additionalCard && this.additionalCard[1] && this.additionalCard[0]) {
      const currentCard = this.additionalCard[0].cards!.pop();
      this.additionalCard[1].cards = this.additionalCard[1]!.cards || [];
      if (currentCard) {
        this.additionalCard[1].cards?.push(currentCard);
        const endPosition = this.additionalCard[1].rootPosition;
        this.changeCardPosition(endPosition, currentCard.position!, () => {
          currentCard.opened = true;
          currentCard.position = endPosition;
          this.showCardFront(currentCard);
        });
      } else {
        if (!this.isEmptyAdditional) {
          this.renderAdditionalEmpty(this.additionalCard[0].rootPosition);
          this.isEmptyAdditional = true;
        } else {
          this.additionalCard[0].cards = this.additionalCard[1].cards;
          this.additionalCard[1].cards = [];
          this.renderAdditionalEmpty(this.additionalCard[1].rootPosition);
          this.changeCardPosition(this.additionalCard[0].rootPosition, this.additionalCard[1].rootPosition, () => {
            this.isEmptyAdditional = false;
          });
        }
      }
    }
  }

  moveCardOnClick(draggableTargetCard: Card) {
    const newStack = this.findCardStack(draggableTargetCard);
    const stack = this.findCardStack(this.draggableCard!);
    if (stack && stack.cards && newStack && newStack.cards) {
      stack.cards = stack.cards.filter((item) => item !== this.draggableCard!);
      if (!stack.cards.length) {
        this.renderAdditionalEmpty(stack.rootPosition);
      } else {
        this.renderPreviousCard(stack);
      }
      if (draggableTargetCard.position) {
        const newPosition = {
          x: draggableTargetCard.position.x,
          y: draggableTargetCard.position.y + this.targetStackMargin,
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
    const lastCard = stack.cards![stack.cards!.length - 1];
    lastCard.opened = true;
    lastCard.draggable = true;
    this.clearCardsPosition(this.draggableCard!.position!);
    this.renderCard(this.gameCanvas!, lastCard.position!);
    this.showCardFront(lastCard);
  }

  findCardStack(card: Card): Tree | undefined {
    let result;
    Object.entries(this.secondaryStrokes!).forEach(([key, value]) => {
      if (value.cards!.includes(card)) {
        result = this.secondaryStrokes![key];
        return;
      }
    });
    if (!result) {
      Object.entries(this.additionalCard!).forEach(([key, value]) => {
        if (value.cards!.includes(card)) {
          result = this.additionalCard![key];
          return;
        }
      });
    }
    return result;
  }

  renderAdditionalEmpty(start: CardLeftUp) {
    const ctx = this.gameCanvas!.getContext('2d');
    if (ctx) {
      ctx.clearRect(start.x, start.y, this.cardWidth, this.cardHeight);
      this.getStrokeStyle(ctx);
      ctx.strokeRect(start.x, start.y, this.cardWidth, this.cardHeight);
    }
  }
}

export default new GameEngine();
