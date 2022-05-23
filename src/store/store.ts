import {Middleware} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers/reducer';
import rootSaga from './reducers/saga';
import IConfiguredStore from './reducers/configured-store';

const sagaMiddleware = createSagaMiddleware();

const middleware: Middleware[] = [sagaMiddleware];

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
