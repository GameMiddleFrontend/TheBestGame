import React, {useCallback, useEffect} from 'react';
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
import AppRoutes from '../../utils/app-routes';
import {NotificationContainer} from '../../containers/common/notification/notification.container';
import WithLayout from '../common/page-layout';
import {useDispatch} from 'react-redux';
import {Actions as userActions} from '../../redux/reducers/user/user.ducks';
import startServiceWorker from '../../serviceWorker/SWStart';
/*TODO добавить алиасы для путей*/

function App() {
  startServiceWorker();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getUser());
  }, []);

  const getElement = useCallback((component: React.ElementType) => {
    return <WithLayout component={component} />;
  }, []);

  return (
    <div className="app">
      <ErrorBoundaryComponent FallbackComponent={ErrorFallbackComponent}>
        <Router>
          <Routes>
            <Route path={AppRoutes.HOME} element={getElement(MainPage)} />
            <Route path={AppRoutes.LOGIN} element={getElement(LoginPage)} />
            <Route path={AppRoutes.REGISTER} element={getElement(RegisterPage)} />
            <Route path={AppRoutes.GAME} element={getElement(GamePage)} />
            <Route path={AppRoutes.SETTINGS} element={getElement(SettingsPage)} />
            <Route path={AppRoutes.LEADERBOARD} element={getElement(LeaderboardPage)} />
            <Route path={AppRoutes.FORUM} element={getElement(ForumPage)} />
            <Route path={`${AppRoutes.FORUM}/*`} element={getElement(ForumThemePage)} />
            <Route path="/*" element={getElement(NotFoundPage)} />
          </Routes>
        </Router>
        <NotificationContainer />
      </ErrorBoundaryComponent>
    </div>
  );
}

export default App;
