import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import {Provider} from 'react-redux';

import store from './redux';

import './styles/index.scss';

class RootComponent extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(
      <StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </StrictMode>,
      this,
    );
  }
}
customElements.define('game-app', RootComponent);
