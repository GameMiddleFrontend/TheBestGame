import React, {useCallback, useEffect, useRef} from 'react';
import Button from '@common/button';
import GameEngine from '@utils/solitaire/solitaire.game';
import useFullscreenTrigger from '@hooks/fullScreen';
import MediaAudio from '@common/media-audio';

import '@images/play.svg';
import '@images/restart.svg';
import '@images/undo.svg';

import './game.scss';

const audioSource = 'https://cdn.pixabay.com/audio/2022/05/17/audio_407815a564.mp3';
const mimeCodecAudio = 'audio/mpeg';

const GamePage = () => {
  let gameEngine: GameEngine;

  useFullscreenTrigger();
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
        <div className={'media-audio-wrapper'}>
          <MediaAudio src={audioSource} codec={mimeCodecAudio} />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
