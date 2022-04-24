import React, {useCallback} from 'react';
import {compose} from 'redux';

import Button from '../../common/button';
import playImg from '../../../styles/images/play.svg';
import replayImg from '../../../styles/images/restart.svg';
import undoImg from '../../../styles/images/undo.svg';
import withAuth from '../../../hooks/chechAuthHookHOC';

import './game.scss';

const GamePage = () => {
  const handleStartGame = useCallback(() => {
    //TODO
  }, []);

  const handleReplayGame = useCallback(() => {
    //TODO
  }, []);

  const handleUndo = useCallback(() => {
    //TODO
  }, []);

  return (
    <div className={'game-page'}>
      <div className={'game-buttons-panel'}>
        {/*TODO тултипы для кнопок*/}
        <Button className={'button-icon-only button-rounded'} icon={playImg} onClick={handleStartGame} />
        <Button className={'button-icon-only button-rounded'} icon={replayImg} onClick={handleReplayGame} />
        <Button className={'button-icon-only button-rounded'} icon={undoImg} onClick={handleUndo} />
      </div>
    </div>
  );
};

const GamePageHOC = compose(withAuth(GamePage));

export default GamePageHOC;
