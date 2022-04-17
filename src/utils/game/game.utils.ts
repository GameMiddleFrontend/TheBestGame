import {Card, CardLeftUp, CardSuit, CardValue, getStringKeys} from '../../models/game.models';
import {SecondaryTree, TargetTree} from './types';

class GameEngine {
  gameCanvas: HTMLCanvasElement | undefined;

  animationCanvas: HTMLCanvasElement | undefined;

  private isStarted = false;

  private cardStack: Array<Card> = [];

  private startCardsPosition: CardLeftUp | undefined;

  private targetStrokes: {[p: string]: TargetTree} | undefined;

  private secondaryStrokes: {[p: string]: SecondaryTree} | undefined;

  private additionalCard: {[p: string]: TargetTree} | undefined;

  private cardWidth = 20;

  private cardHeight = 30;

  private targetStackMargin = 5;

  private secondaryStackCount = 7;

  private targetStackPositions: Array<number> = [];

  public init(gameCanvas: HTMLCanvasElement, animationCanvas: HTMLCanvasElement) {
    this.gameCanvas = gameCanvas;
    this.animationCanvas = animationCanvas;
  }

  public renderStartElements() {
    this.renderStartStackPosition();
    this.renderTargetStrokes();
    this.renderAdditionalStack();
    this.renderStrokes();
  }

  renderStartStackPosition() {
    const {width, height} = this.gameCanvas!;
    const point: CardLeftUp = {x: width / 2 - this.cardWidth / 2, y: height - this.targetStackMargin - this.cardHeight};
    this.startCardsPosition = point;
    this.renderCard(this.gameCanvas!, point);
  }

  private renderCard(canvas: HTMLCanvasElement, point: CardLeftUp) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.getSquareStyles(ctx);
    ctx.fillRect(point.x + 0.5, point.y + 0.5, this.cardWidth, this.cardHeight);
  }

  private getSquareStyles(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'blue';
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
      ctx.strokeRect(point.x + 0.5, point.y + 0.5, this.cardWidth, this.cardHeight);
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
      ctx.strokeRect(point.x + 0.5, point.y + 0.5, this.cardWidth, this.cardHeight);
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
    ctx.strokeRect(point.x + 0.5, point.y + 0.5, this.cardWidth, this.cardHeight);
    let position: TargetTree = {rootPosition: point};
    this.additionalCard = Object.assign({}, {0: position});
    x += this.cardWidth + 2 * this.targetStackMargin;
    point = {x, y: this.targetStackMargin};
    ctx.strokeRect(point.x + 0.5, point.y + 0.5, this.cardWidth, this.cardHeight);
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
      console.log(this.cardStack);
      console.log(this.secondaryStrokes);
      console.log(this.targetStrokes);
      console.log(this.additionalCard);
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
          canTake: false,
          next: null,
          prev: prevCard,
        };
        if (prevCard) {
          prevCard.next = newCard;
        }
        result.push(newCard);
        if (value === CardValue[CardValue.Ace]) {
          this.targetStrokes![suit as string].nextCard = newCard;
          this.targetStrokes![suit as string].count = 0;
        }
        prevCard = newCard;
      });
      return result;
    }, []);
  }

  private changeCardStackPlaces() {
    for (let i = this.cardStack.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.cardStack[i];
      this.cardStack[i] = this.cardStack[j];
      this.cardStack[j] = temp;
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
          success('allIn');
        }
      }
      success = success || resolve;
      const callback = () => {
        cardNumber++;
        if (cardNumber > stackNumber) {
          stackNumber++;
          cardNumber = 0;
        }
        this.fillSecondaryStacks(stackNumber, cardNumber, success);
      };
      const {rootPosition} = this.secondaryStrokes![this.secondaryStackCount - stackNumber - 1];
      this.changeCardPosition(
        {x: rootPosition.x, y: rootPosition.y + cardNumber * this.targetStackMargin},
        this.startCardsPosition!,
        callback,
      );
    });
  }

  private changeCardPosition(end: CardLeftUp, startPos: CardLeftUp, callback?: () => void) {
    this.renderCard(this.animationCanvas!, startPos);
    const ctx = this.animationCanvas!.getContext('2d') as CanvasRenderingContext2D;

    const counter = 10;
    let count = 1;

    const deltaX = (end.x - startPos.x) / counter;
    const deltaY = (end.y - startPos.y) / counter;

    let currentPoint = startPos;
    let nextPoint;

    const step = () => {
      nextPoint = {x: startPos.x + deltaX * count + 0.5, y: startPos.y + deltaY * count + 0.5};
      if ((nextPoint.x >= end.x && deltaX > 0) || (nextPoint.x <= end.x && deltaX < 0)) {
        nextPoint = end;
      }
      ctx.clearRect(currentPoint.x, currentPoint.y, this.cardWidth + 1, this.cardHeight + 1);
      this.getSquareStyles(ctx);
      ctx.fillRect(nextPoint.x + 0.5, nextPoint.y + 0.5, this.cardWidth, this.cardHeight);
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
    debugger
    this.clearStartCardsPosition();
    const {rootPosition} = this.additionalCard![0];
    this.changeCardPosition(rootPosition, this.startCardsPosition!);
  }

  clearStartCardsPosition() {
    const ctx = this.gameCanvas?.getContext('2d');
    if (ctx) {
      ctx.clearRect(this.startCardsPosition!.x, this.startCardsPosition!.y, this.cardWidth + 1, this.cardHeight + 1);
    }
  }
}

export default new GameEngine();
