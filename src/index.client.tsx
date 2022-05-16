import React, {StrictMode} from 'react';
import {Provider} from 'react-redux';

import {hydrateRoot} from 'react-dom/client';

import initStore from './store';

import './styles/index.scss';
import IConfiguredStore from './store/reducers/configured-store';
import ErrorBoundaryComponent from './components/common/error-boundary';
import ErrorFallbackComponent from './components/common/error-fallback';
import {NotificationContainer} from './containers/common/notification/notification.container';
import {BrowserRouter} from 'react-router-dom';

import App from './components/app';

declare global {
  interface Window {
    __INITIAL_STATE__?: IConfiguredStore;
  }
}

class RootComponent extends HTMLElement {
  connectedCallback() {
    const store = initStore(window.__INITIAL_STATE__);
    if (window.__INITIAL_STATE__) {
      delete window.__INITIAL_STATE__;
    }
    hydrateRoot(
      this,
      <StrictMode>
        <Provider store={store}>
          <ErrorBoundaryComponent FallbackComponent={ErrorFallbackComponent}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <NotificationContainer />
          </ErrorBoundaryComponent>
        </Provider>
      </StrictMode>,
    );
  }
}
customElements.define('game-app', RootComponent);
