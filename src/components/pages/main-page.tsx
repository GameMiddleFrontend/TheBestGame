import React from 'react';
import {Link} from 'react-router-dom';

// @ts-ignore
import cardsLogo from '../../images/cards.svg';
// @ts-ignore
import gameImage from '../../images/game.jpg';
import '../../styles/main-page.scss';

function MainPage() {
  return (
    <div className={'main-container'}>
      <div className={'main-page-header'}>
        <h1 className={'game-name-label'}>Косынка</h1>
        <div className={'links-container'}>
          <Link className={'link'} to={'/sign-in'}>
            Войти
          </Link>
          <Link className={'link'} to={'/sign-up'}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
      <main className={'main-content'}>
        <div className={'game-image-container'}>
          <img src={gameImage} alt={'Игра'} className={'game-image'} />
        </div>
        <article className={'game-rules'}>
          <h3>Правила</h3>
          <p>
            Играется одной колодой в 52 карты. Цель игры — разложить карты по мастям в порядке от туза до короля в
            четыре стопки (их иногда называют базовыми, или «домами»). Карту можно перекладывать на другую рангом выше,
            но другого цвета (чёрного или красного). В каждую из четырёх базовых стопок (домов), по которым необходимо
            разложить все карты, сначала кладутся тузы, затем двойки, тройки и так далее до короля. Карты можно сдавать
            из оставшейся от раздачи колоды (в левом верхнем углу) либо по одной, либо по три штуки, в зависимости от
            модификации. В свободную ячейку (не дом) можно положить только короля. Игра заканчивается, когда все карты
            разложены. Цель игры состоит в том, чтобы разложить все карты в четыре стопки по возрастанию, начиная с
            туза, так, чтобы карты одной масти находились в одной стопке.
          </p>
        </article>
      </main>
    </div>
  );
}

export default MainPage;
