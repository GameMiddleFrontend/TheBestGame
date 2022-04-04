import React from 'react';
import {Link} from 'react-router-dom';

function MainPage() {
  return (
    <div>
      {/*/!*TODO для удобства разработки*!/*/}
      <ul>
        <li>
          <Link to={'/sign-in'}>LoginPage</Link>
        </li>
        <li>
          <Link to={'/sign-up'}>RegisterPage</Link>
        </li>
        <li>
          <Link to={'/settings'}>SettingsPage</Link>
        </li>
        <li>
          <Link to={'/leaderboard'}>LeaderboardPage</Link>
        </li>
        <li>
          <Link to={'/forum'}>ForumPage</Link>
        </li>
      </ul>
      {/*/!*TODO END*!/*/}
    </div>
  );
}

export default MainPage;
