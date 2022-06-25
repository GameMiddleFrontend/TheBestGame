import React, {StrictMode} from 'react';
import {Request, Response} from 'express';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router-dom/server';

import initStore from '@store/index';
import App from '@components/app';
import ErrorBoundaryComponent from '@common/error-boundary';
import ErrorFallbackComponent from '@common/error-fallback';
import AuthService from '@services/auth.service';
import {Actions as AuthActions} from '@store/reducers/user/user.ducks';
import {Actions as UserActions} from '@store/reducers/auth/auth.ducks';
import {CurrentUserItem} from '@models/user.model';

export default async (req: Request, res: Response) => {
  let store, currentUser: CurrentUserItem;
  const yaCookies = ['authCookie', 'uuid'];
  const cookieString = yaCookies.reduce((result: string, current: string) => {
    if (req.cookies[current]) {
      result += ` ${current}=${req.cookies[current]};`;
    }
    return result;
  }, '');
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  AuthService.auth(cookieString, fullUrl)
    .then((user) => {
      currentUser = user;
    })
    .catch((error) => error)
    .finally(() => {
      store = initStore();
      if (currentUser) {
        store.dispatch(AuthActions.setUser(currentUser));
        store.dispatch(UserActions.setLoggedIn(true));
        store.dispatch(UserActions.setLoading(false));
      }
      const jsx = (
        <StrictMode>
          <Provider store={store}>
            <ErrorBoundaryComponent FallbackComponent={ErrorFallbackComponent}>
              <StaticRouter location={req.url}>
                <App />
              </StaticRouter>
            </ErrorBoundaryComponent>
          </Provider>
        </StrictMode>
      );
      const reactHtml = renderToString(jsx);
      const reduxState = store.getState();
      res.status(200).send(getHtml(reactHtml, reduxState));
    });
};

function getHtml(reactHtml: string, reduxState = {}) {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="shortcut icon" type="image/png" href="/images/favicon.png">
          <title>Game</title>
          <base href="/">
      </head>
      <body>
          <game-app>${reactHtml}</game-app>
          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(reduxState)}
          </script>
          <script src="/main.js"></script>
      </body>
      </html>
    `;
}
