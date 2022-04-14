import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import spadesSrc from '../../../styles/images/spades.svg';
import './main.scss';
import AuthAPI from '../../../services/authAPI';
import Button from '../../common/button';
import AppRoutes from '../../../utils/app-routes';

function MainPage() {
  const navigate = useNavigate();
  const [authorized, setAutorized] = useState(false);

  useEffect(() => {
    AuthAPI.auth()
      .then((user) => {
        setAutorized(true);
        console.dir(user);
      })
      .catch(() => {
        setAutorized(false);
      });
  }, [authorized]);

  const handleNavigate = useCallback((route: AppRoutes) => {
    navigate(route);
  }, []);

  return (
    <div className={'page main-page'}>
      <div className={'main-page-header'}>
        <h1 className={'game-name-label'}>Косынка</h1>
        <div className={'buttons-container'}>
          {authorized ? (
            <Button className={'button-text main-page-subtext'} onClick={handleNavigate.bind(null, AppRoutes.GAME)}>
              Новая игра
            </Button>
          ) : (
            <Button className={'button-text main-page-subtext'} onClick={handleNavigate.bind(null, AppRoutes.LOGIN)}>
              Вход
            </Button>
          )}
          <Button className={'button-text main-page-subtext'} onClick={handleNavigate.bind(null, AppRoutes.REGISTER)}>
            Регистрация
          </Button>
        </div>
      </div>
      <main className={'main-content'}>
        <article className={'game-rules'}>
          <h3 className="main-page-subtext">Правила</h3>
          <p>Играется одной колодой в 52 карты. </p>
          <p>
            <b>Цель игры</b> — разложить карты по мастям в порядке от туза до короля в четыре стопки (их иногда называют
            базовыми, или «домами»).
          </p>
          {/*TODO grid*/}
          <ul>
            <li>
              <img src={spadesSrc} />
              Карту можно перекладывать на другую рангом выше, но другого цвета (чёрного или красного).{' '}
            </li>
            <li>
              В каждую из четырёх базовых стопок (домов), по которым необходимо разложить все карты, сначала кладутся
              тузы, затем двойки, тройки и так далее до короля.{' '}
            </li>
            <li>
              Карты можно сдавать из оставшейся от раздачи колоды (в левом верхнем углу) либо по одной, либо по три
              штуки, в зависимости от модификации.{' '}
            </li>
            <li>
              В свободную ячейку (не дом) можно положить только короля. Игра заканчивается, когда все карты разложены.
            </li>
          </ul>
        </article>
        {/*<div className={'game-image-container'}>*/}
        {/*  <img src={gameImage} alt={'Игра'} className={'game-image'} />*/}
        {/*</div>*/}
      </main>
    </div>
  );
}

export default MainPage;
