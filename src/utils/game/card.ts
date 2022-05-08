// import {BLACK_CARD_COLORS, Card, CardOptions, CardRankValues, CardSuitValues, Position} from '../../models/card.models';
// import card from '../../styles/images/cards/clubs_two.svg';
//
// const minCardWidth = 50;
// const minCardHeight = minCardWidth * 2;
//
// /*TODO хранить картинку у себя */
// const backImagePath = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Card_back_06.svg';
// const cardBorderSize = 3;
//
// export function drawCard(ctx: CanvasRenderingContext2D, card: Card, position?: Position) {
//   if (position) {
//     card.currentPosition = position;
//   }
//
//   drawCardImg(ctx, card);
// }
//
// function drawCardImg(ctx: CanvasRenderingContext2D, card: Card) {
//   getImageStyles(ctx);
//
//   const image = new Image();
//   image.src = card.opened
//     ? require(`/src/styles/images/cards/${card.suit.toLocaleLowerCase()}_${card.rank.toLocaleLowerCase()}.svg`)
//     : require(`/src/styles/images/cards/card_back.svg`);
//   image.width = card.options.width;
//   image.height = card.options.height;
//
//   ctx.drawImage(
//     image,
//     card.currentPosition.x,
//     card.currentPosition.y,
//     card.options?.width || minCardWidth,
//     card.options?.height || minCardHeight,
//   );
// }
//
// export function clearDrawingCard(ctx: CanvasRenderingContext2D, card: Card, clearCardFromPile: (card: Card) => void) {
//   if (card.currentPosition) {
//     ctx.clearRect(
//       card.currentPosition.x - cardBorderSize,
//       card.currentPosition.y - cardBorderSize,
//       card.options?.width + 2 * cardBorderSize,
//       card.options?.height + 2 * cardBorderSize,
//     );
//   }
//   clearCardFromPile(card);
// }
//
// function getImageStyles(ctx: CanvasRenderingContext2D) {
//   ctx.imageSmoothingEnabled = false;
// }
//
// export function openCard(card: Card) {
//   card.opened = true;
//   card.draggable = true;
// }
//
// function drawFaceCard(ctx: CanvasRenderingContext2D, card: Card, position: Position) {
//   getRecaStyle(ctx);
//   ctx.fillRect(position.x, position.y, card.options.width, card.options.height);
//   ctx.strokeRect(position.x, position.y, card.options.width, card.options.height);
//   getTextStyle(ctx, BLACK_CARD_COLORS.includes(card.suit));
//
//   const suitName = CardSuitValues[card.suit];
//   const rankName = CardRankValues[card.rank];
//
//   const textCardMarginX = card.options.width / 5;
//   const textCardMarginY = 5;
//
//   const textCardMaxWidth = card.options.width / 2;
//
//   //верхний левый угол (T-top L-left)
//   const textTLPosX: number = position.x + textCardMarginX;
//   const textTLPosY: number = position.y + textCardMarginY;
//
//   ctx.fillText(`${rankName}`, textTLPosX, textTLPosY, textCardMaxWidth);
//   ctx.fillText(`${suitName}`, textTLPosX, textTLPosY + textCardMarginY, textCardMaxWidth);
//
//   //нижний парвый угол
//   const textBRPosX: number = position.x + card.options.width - textCardMarginX;
//   const textBRPosY: number = position.y + card.options.height - textCardMarginY;
//
//   ctx.save();
//   ctx.rotate(Math.PI);
//
//   ctx.fillText(`${rankName}`, -textBRPosX, -textBRPosY, textCardMaxWidth);
//   ctx.fillText(`${suitName}`, -textBRPosX, -textBRPosY + textCardMarginY, textCardMaxWidth);
//
//   ctx.restore();
// }
//
// function getRecaStyle(ctx: CanvasRenderingContext2D) {
//   ctx.strokeStyle = '#000';
//   ctx.lineWidth = cardBorderSize;
//   ctx.fillStyle = 'white';
// }
//
// function getTextStyle(ctx: CanvasRenderingContext2D, isBlackColor = true) {
//   ctx.fillStyle = isBlackColor ? '#000' : '#901414';
//   ctx.font = 'bold 25px sans-serif';
//   ctx.textAlign = 'center';
// }
