import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/login-page/login-page';
import RegisterPage from '../pages/register-page/register-page';
import ForumPage from '../pages/forum-page/forum-page';
import SettingsPage from '../pages/settings/settings.page';
import LeaderboardPage from '../pages/leaderboard/leaderboard.page';
import MainPage from '../pages/main/main.page';
import NotFoundPage from '../pages/not-found-page';
import ErrorBoundaryComponent from '../common/error-boundary';
import ErrorFallbackComponent from '../common/error-fallback';
import ForumThemePage from '../pages/forum-theme-page';
import GamePage from '../pages/game';
import AppRoutes from '../../utils/app-routes';

function App() {
  return (
    <div className="app">
      <ErrorBoundaryComponent FallbackComponent={ErrorFallbackComponent}>
        <Router>
          <Routes>
            <Route path={AppRoutes.HOME} element={<MainPage />} />
            <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
            <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
            <Route path={AppRoutes.GAME} element={<GamePage />} />
            <Route path={AppRoutes.SETTINGS} element={<SettingsPage />} />
            <Route path={AppRoutes.LEADERBOARD} element={<LeaderboardPage />} />
            <Route path={AppRoutes.FORUM} element={<ForumPage />} />
            <Route path={`${AppRoutes.FORUM}/*`} element={<ForumThemePage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ErrorBoundaryComponent>
    </div>
  );
}

export default App;
