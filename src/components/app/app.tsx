import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from '../pages/login-page/login-page';
import RegisterPage from '../pages/register-page/register-page';
import ForumPage from '../pages/forum-page/forum-page';
import SettingsPage from '../pages/settings/settings.page';
import LeaderboardPage from '../pages/leaderboard/leaderboard.page';
import MainPage from '../pages/main-page';
import NotFoundPage from '../pages/not-found-page';
import ErrorBoundaryComponent from '../common/error-boundary';
import ErrorFallbackComponent from '../common/error-fallback';
import ForumThemePage from '../pages/forum-theme-page';
import GamePage from '../pages/game';

function App() {
  return (
    <div className="app">
      <ErrorBoundaryComponent FallbackComponent={ErrorFallbackComponent}>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/sign-up" element={<RegisterPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum/*" element={<ForumThemePage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ErrorBoundaryComponent>
    </div>
  );
}

export default App;
