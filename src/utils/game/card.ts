import {BLACK_CARD_COLORS, Card, CardOptions, CardRankValues, CardSuitValues, Position} from '../../models/card.models';

const minCardWidth = 50;
const minCardHeight = minCardWidth * 2;

const backImagePath = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg';

//TODO getFaceCardImage
function getBackCardShape(options: CardOptions) {
  const image = new Image();
  image.src = backImagePath;
  image.width = options.width;
  image.height = options.height;
  return image;
}

function getFaceCardShape(card: Card, options: CardOptions) {
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

export function fillCardShape(card: Card) {}

export function renderCard(canvas: HTMLCanvasElement, card: Card, position: Position) {
  if (card && card.position && card.options) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    //this.getImageStyles(ctx);
    ctx.drawImage(
      getBackCardImage(card.options),
      card.position.x,
      card.position.y,
      card.options?.width || minCardWidth,
      card.options?.height || minCardHeight,
    );
  }
}

function showCardFront(card: Card) {
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
