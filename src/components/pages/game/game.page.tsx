import React, {useCallback, useEffect} from 'react';
import Button from '../../common/button';
import playImg from '../../../styles/images/play.svg';
import replayImg from '../../../styles/images/restart.svg';
import undoImg from '../../../styles/images/undo.svg';
import GameCanvas from '../../common/canvas';
import GameEngine from '../../../utils/game/game.utils';
import useFullscreenTrigger from '../../../hooks/fullScreen';

import './game.scss';

const gameCanvasClass = 'game';
const animationCanvasClass = 'game-animation';
const canvasContainerClass = 'game-container';

const GamePage = () => {
  useFullscreenTrigger();
  const handleStartGame = useCallback(() => {
    GameEngine.startGame();
  }, []);

  const handleReplayGame = useCallback(() => {
    GameEngine.renderStartElements();
  }, []);

  const handleUndo = useCallback(() => {
    //TODO
  }, []);

  useEffect(() => {
    GameEngine.init(
      document.querySelector(`.${gameCanvasClass}`) as HTMLCanvasElement,
      document.querySelector(`.${animationCanvasClass}`) as HTMLCanvasElement,
      canvasContainerClass,
    );
    GameEngine.renderStartElements();
  });

  return (
    <div className={'game-page'}>
      <div className={'game-container'}>
        <div className={'game-buttons-panel'}>
          {/*TODO тултипы для кнопок*/}
          <Button className={'button-icon-only button-rounded'} icon={playImg} onClick={handleStartGame} />
          <Button className={'button-icon-only button-rounded'} icon={replayImg} onClick={handleReplayGame} />
          <Button className={'button-icon-only button-rounded'} icon={undoImg} onClick={handleUndo} />
        </div>
        <GameCanvas className={gameCanvasClass} />
        <canvas className={animationCanvasClass} />
      </div>
    </div>
  );
};

export default GamePage;
