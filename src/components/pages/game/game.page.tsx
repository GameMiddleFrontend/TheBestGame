import React, {useCallback} from 'react';
import TopBarComponent from '../../common/top-bar/top-bar.component';
import Button from '../../common/button';
import playImg from '../../../styles/images/play.svg';
import replayImg from '../../../styles/images/restart.svg';
import undoImg from '../../../styles/images/undo.svg';

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
    <div className={'page game-page'}>
      <TopBarComponent />
      <div className={'game-buttons-panel'}>
        {/*TODO тултипы для кнопок*/}
        <Button className={'button-icon-only button-rounded'} icon={playImg} onClick={handleStartGame} />
        <Button className={'button-icon-only button-rounded'} icon={replayImg} onClick={handleReplayGame} />
        <Button className={'button-icon-only button-rounded'} icon={undoImg} onClick={handleUndo} />
      </div>
    </div>
  );
};

export default GamePage;
