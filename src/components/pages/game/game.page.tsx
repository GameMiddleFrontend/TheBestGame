import React, {useCallback, useEffect, useRef} from 'react';
import Button from '@common/button';
import GameEngine from '@utils/solitaire/solitaire.game';

import '@images/play.svg';
import '@images/restart.svg';
import '@images/undo.svg';

import './game.scss';

const GamePage = () => {
  let gameEngine: GameEngine;

  const handleStartGame = useCallback(() => {
    gameEngine && gameEngine.startGame();
  }, []);

  const staticCanvas = useRef(null);
  const dynamicCanvas = useRef(null);
  const canvasContainer = useRef(null);

  const handleReplayGame = useCallback(() => {
    gameEngine && gameEngine.renderStartElements();
  }, []);

  const handleUndo = useCallback(() => {
    //TODO
  }, []);

  useEffect(() => {
    if (staticCanvas.current && dynamicCanvas.current && canvasContainer.current) {
      gameEngine = new GameEngine(staticCanvas.current, dynamicCanvas.current, canvasContainer.current);
      gameEngine.renderStartElements();
    }
  }, []);

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
        <canvas ref={staticCanvas} className={'game'} />
        <canvas ref={dynamicCanvas} className={'game-animation'} />
      </div>
    </div>
  );
};

export default GamePage;
