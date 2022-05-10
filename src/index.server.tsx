import initStore from './redux/store';
import ReactDOM from 'react-dom';
import React, {StrictMode} from 'react';
import {Provider} from 'react-redux';
import App from './components/app';

class RootComponent extends HTMLElement {
  connectedCallback() {
    const store = initStore();
    ReactDOM.hydrate(
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
