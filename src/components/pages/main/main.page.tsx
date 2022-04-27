import React, {useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import AppRoutes from '../../../utils/app-routes';
import Button from '../../common/button';
import TextEnum from '../../../models/enum/text.enum';
import mainPageImage from '../../../styles/images/ace-of-spades.svg';

import './main.scss';

function MainPage() {
  const userData = useSelector((state: IConfiguredStore) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const handleNavigate = useCallback((route: AppRoutes) => {
    navigate(route);
  }, []);

  return (
    <div className={'page-container main-container'}>
      <div className={'main-page-header'}>
        <h1 className={'game-name-label'}>Косынка</h1>
        <div className={'buttons-container'}>
          {userData ? (
            <Button className={'button-text main-page-subtext'} onClick={handleNavigate.bind(null, AppRoutes.GAME)}>
              {TextEnum.NEW_GAME}
            </Button>
          ) : (
            <>
              <Button className={'button-text main-page-subtext'} onClick={handleNavigate.bind(null, AppRoutes.LOGIN)}>
                {TextEnum.LOGIN}
              </Button>
              <Button
                className={'button-text main-page-subtext'}
                onClick={handleNavigate.bind(null, AppRoutes.REGISTER)}
              >
                {TextEnum.REGISTER}
              </Button>
            </>
          )}
        </div>
      </div>
      <main className={'main-content'}>
        <article className={'game-rules'}>
          <h3 className="main-page-subtext">Правила</h3>
          <p>Играется одной колодой в 52 карты.</p>
          <p>
            <b>Цель игры</b> — разложить карты по мастям в порядке от туза до короля в четыре стопки (их иногда называют
            базовыми, или «домами»).
          </p>
          <ul>
            <li>Карту можно перекладывать на другую рангом выше, но другого цвета (чёрного или красного). </li>
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
        <div className={'background-img-container'}>
          <img className={'background-img'} src={mainPageImage} />
        </div>
      </main>
    </div>
  );
}

export default MainPage;
