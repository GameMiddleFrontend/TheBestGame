import React, {StrictMode} from 'react';
import {Request, Response} from 'express';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router-dom/server';

import initStore from '../store';
import App from '@components/app';
import ErrorBoundaryComponent from '@components/common/error-boundary';
import ErrorFallbackComponent from '@components/common/error-fallback';

export default (req: Request, res: Response) => {
  const location = req.url;
  const store = initStore();

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
