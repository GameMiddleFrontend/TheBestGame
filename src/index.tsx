import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/app';

import './styles/index.scss';

class RootComponent extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(
      <StrictMode>
        <App />
      </StrictMode>,
      this,
    );
  }
}
customElements.define('game-app', RootComponent);
