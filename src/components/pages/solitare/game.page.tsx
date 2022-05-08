import React, {useCallback, useEffect, useRef} from 'react';

import {Game} from '../../../utils/solitaire/solitaire';

import './game.scss';

const GamePage = () => {
  const controls = document.getElementById('controls');
  const score = document.getElementById('score');

  useEffect(() => {
    const game = new Game('#container');

    game.start();

    // game.on('start', function () {
    //   score.textContent = 'Score: ' + this.score;
    // });
    //
    // game.on('change', function () {
    //   score.textContent = 'Score: ' + this.score;
    // });
    //
    // controls.addEventListener(
    //   'click',
    //   function (e) {
    //     const t = e.target;
    //     if (t.nodeName === 'BUTTON') {
    //       const action = t.getAttribute('data-action');
    //       game[action]();
    //     }
    //   },
    //   false,
    // );
  }, []);

  return (
    <>
      <div id="controls">
        <button type="button" data-action="undo">
          Undo
        </button>
        <button type="button" data-action="hint">
          Hint
        </button>
        <button type="button" data-action="cheat">
          Force Win
        </button>
        <button type="button" data-action="start">
          Restart
        </button>
        <div id="score">Score: 0</div>
      </div>
      <div id="container"></div>
    </>
  );
};

export default GamePage;
