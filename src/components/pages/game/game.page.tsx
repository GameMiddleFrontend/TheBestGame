import React from 'react';
import TopBarComponent from '../../common/top-bar/top-bar.component';
import ButtonComponent from '../../common/button';

import './game.scss';

const GamePage = () => {
  return (
    /*TODO общий стиль page*/
    <div className={'game-page'}>
      <TopBarComponent />
      <div style={{margin: '200px'}}>
        <ButtonComponent className={'button-icon-only button-rounded'}>{/*TODO Иконки*/}</ButtonComponent>
        <ButtonComponent className={'button-icon-only button-rounded'} />
        <ButtonComponent className={'button-icon-only button-rounded'} />
      </div>
    </div>
  );
};

export default GamePage;
