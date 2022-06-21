import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPage from '@pages/login/login.page';
import RegisterPage from '@pages/register/register.page';
import ForumPage from '@pages/forum-page/forum-page';
import SettingsPage from '@pages/settings/settings.page';
import LeaderboardPage from '@pages/leaderboard/leaderboard.page';
import MainPage from '@pages/main/main.page';
import NotFoundPage from '@pages/not-found-page';
import ForumThemePage from '@pages/forum-theme-page';
import GamePage from '@pages/game';
import AppRoutes from '@utils/app-routes';
import useLayout from '@hooks/withLayout';
import {useDispatch} from 'react-redux';
import {Actions as UserActions} from '@store/reducers/user/user.ducks';
import ThemeProvider from '../../contexts/theme/theme.provider';

function App() {
  //startServiceWorker();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserActions.getUser());
  }, []);

  const getElement = useLayout();

  return (
    <ThemeProvider>
      <Routes>
        <Route path={AppRoutes.HOME} element={getElement(MainPage)} />
        <Route path={AppRoutes.LOGIN} element={getElement(LoginPage)} />
        <Route path={AppRoutes.REGISTER} element={getElement(RegisterPage)} />
        <Route path={AppRoutes.GAME} element={getElement(GamePage)} />
        <Route path={AppRoutes.SETTINGS} element={getElement(SettingsPage)} />
        <Route path={AppRoutes.LEADERBOARD} element={getElement(LeaderboardPage)} />
        <Route path={AppRoutes.FORUM} element={getElement(ForumPage)} />
        <Route path={`${AppRoutes.FORUM}/:threadId`} element={getElement(ForumThemePage)} />
        <Route path="/*" element={getElement(NotFoundPage)} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
