import React, {useCallback, useEffect, useRef, useState} from 'react';
import Button from '@common/button';
import GameEngine from '@utils/solitaire/solitaire.game';
import useFullscreenTrigger from '@hooks/fullScreen';
import MediaAudio from '@common/media-audio';
import Popup from 'reactjs-popup';
import {Actions as LeaderboardActions} from '@store/reducers/leaderboard/leaderboard.ducks';
import {useDispatch, useSelector} from 'react-redux';
import IConfiguredStore from '@store/reducers/configured-store';
import {IStore as IAuthStore} from '@store/reducers/auth/auth.ducks';

import '@images/play.svg';
import '@images/restart.svg';
import '@images/undo.svg';

import './game.scss';

import '../../../styles/sample.mp3';

const audioSource = '/audio/sample.mp3';
const mimeCodecAudio = 'audio/mpeg';

const GamePage = () => {
  let gameEngine: GameEngine;

  const {isLoggedIn} = useSelector<IConfiguredStore, IAuthStore>((state) => state.auth);
  const dispatch = useDispatch();

  const [points, setPoints] = useState(0);
  const [isOpenPopup, setOpenPopup] = useState(false);

  const {FullScreenButton} = useFullscreenTrigger();
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

  const gameOverCallBack = (isWin: boolean, points: number) => {
    if (isWin) {
      setOpenPopup(true);
      dispatch(LeaderboardActions.addLeader({points}));
    }
  };

  const handleClosePopup = useCallback((close: () => void) => {
    handleReplayGame();
    close();
  }, []);

  useEffect(() => {
    if (staticCanvas.current && dynamicCanvas.current && canvasContainer.current) {
      gameEngine = new GameEngine(
        staticCanvas.current,
        dynamicCanvas.current,
        canvasContainer.current,
        setPoints,
        gameOverCallBack,
      );
      gameEngine.renderStartElements();
    }
  }, []);

  return (
    <>
      <div className={'page-container game-page'}>
        <div ref={canvasContainer} className={'game-container'}>
          <div className={'game-buttons-panel'}>
            {/*TODO тултипы для кнопок*/}
            <span className={'game-text'}>{`Счет: ${points}`}</span>
            <Button className={'button-icon-only button-rounded'} icon={'/images/play.svg'} onClick={handleStartGame} />
            <Button
              className={'button-icon-only button-rounded'}
              icon={'/images/restart.svg'}
              onClick={handleReplayGame}
            />
            <Button className={'button-icon-only button-rounded'} icon={'/images/undo.svg'} onClick={handleUndo} />
            <MediaAudio src={audioSource} codec={mimeCodecAudio} />
            <FullScreenButton />
          </div>
          <canvas ref={staticCanvas} className={'game'} />
          <canvas ref={dynamicCanvas} className={'game-animation'} />
        </div>
      </div>
      <Popup open={isOpenPopup}>
        {(close: () => void) => (
          <div className={'modal'}>
            <div className={'modal-content'}>{'Поздравляем!'}</div>
            <div className={'modal-content'}>{`Ваш счет: ${points}`}</div>
            <button className={'modal-close-button'} onClick={handleClosePopup.bind(null, close)}>
              Закрыть
            </button>
          </div>
        )}
      </Popup>
    </>
  );
};

export default GamePage;
