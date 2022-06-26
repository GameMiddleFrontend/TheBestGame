import {Middleware} from 'redux';
import {createLogger} from 'redux-logger';
import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers/reducer';
import rootSaga from './reducers/saga';
import IConfiguredStore from './reducers/configured-store';

const isDevelopment = process.env.NODE_ENV === 'development';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();

let middleware: Middleware[] = [sagaMiddleware];

if (isDevelopment) {
  middleware = [...middleware, logger];
}

export default (preloadedState?: IConfiguredStore) => {
  const store = configureStore({
    reducer,
    middleware,
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });
  sagaMiddleware.run(rootSaga);
  return store;
};
