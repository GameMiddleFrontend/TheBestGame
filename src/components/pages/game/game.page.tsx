import React, {useCallback, useEffect, useRef} from 'react';
import Button from '@common/button';
import GameEngine from '@utils/game/game.engine';

import './game.scss';

import '@images/play.svg';
import '@images/restart.svg';
import '@images/undo.svg';

const gameCanvasClass = 'game';
const animationCanvasClass = 'game-animation';

const GamePage = () => {
  const handleStartGame = useCallback(() => {
    GameEngine.startGame();
  }, []);

  const staticCanvas = useRef(null);
  const dynamicCanvas = useRef(null);
  const canvasContainer = useRef(null);

  const handleReplayGame = useCallback(() => {
    GameEngine.renderStartElements();
  }, []);

  const handleUndo = useCallback(() => {
    //TODO
  }, []);

  useEffect(() => {
    if (staticCanvas.current && dynamicCanvas.current && canvasContainer.current) {
      GameEngine.init(staticCanvas.current, dynamicCanvas.current, canvasContainer.current);
      GameEngine.renderStartElements();
    }
  });

  return (
    <div className={'page-container game-page'}>
      <div ref={canvasContainer} className={'game-container'}>
        <div className={'game-buttons-panel'}>
          {/*TODO тултипы для кнопок*/}
          <Button className={'button-icon-only button-rounded'} icon={'/images/play.svg'} onClick={handleStartGame} />
          <Button
            className={'button-icon-only button-rounded'}
            icon={'/images/restart.svg'}
            onClick={handleReplayGame}
          />
          <Button className={'button-icon-only button-rounded'} icon={'/images/undo.svg'} onClick={handleUndo} />
        </div>
        <canvas ref={staticCanvas} className={gameCanvasClass} />
        <canvas ref={dynamicCanvas} className={animationCanvasClass} />
      </div>
    </div>
  );
};

export default GamePage;
