import React, {StrictMode} from 'react';
import {Provider} from 'react-redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createRoot} from 'react-dom/client';

import initStore from './redux';

import './styles/index.scss';
import IConfiguredStore from './redux/reducers/configured-store';
import ErrorBoundaryComponent from './components/common/error-boundary';
import ErrorFallbackComponent from './components/common/error-fallback';
import {NotificationContainer} from './containers/common/notification/notification.container';
import {BrowserRouter} from 'react-router-dom';

import App from './components/app';

declare global {
  interface Window {
    __INITIAL_STATE__: IConfiguredStore;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => void;
  }
}

class RootComponent extends HTMLElement {
  connectedCallback() {
    const store = initStore();
    const container = this as Element;
    const root = createRoot(container);
    root.render(
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
      this,
    );
  }
}
customElements.define('game-app', RootComponent);
