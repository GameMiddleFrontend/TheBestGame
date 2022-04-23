import {createAction, createReducer, PayloadAction, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery} from 'typed-redux-saga';

import {BaseActionType} from '../../redux.base.types';
import LoginAPI from '../../../services/loginAPI';
import {Actions as notificationActions} from '../notification/notification.duck';
import {getExceptionByError} from '../../../utils/notification';
import {UserLoginItem} from '../../../models/user.model';
import AuthService from '../../../services/auth.service';
import {setUser} from '../user/user.reducer';

enum ActionTypes {
  SET_LOADING = `@auth/setLoading`,
  SET_LOGGED_IN = `@auth/setLoggedIn`,

  GET_USER = `@auth/getUser`,
  LOGIN = `@auth/login`,
  LOGOUT = `@auth/logout`,
}
////////////////////////////////////////
// TYPES
////////////////////////////////////////
type AuthActionType = BaseActionType<ActionTypes.SET_LOADING> | BaseActionType<ActionTypes.SET_LOGGED_IN>;

// ////////////////////////////////////////
// // STORE
// ////////////////////////////////////////
export interface IStore {
  isLoading: boolean;
  isLoggedIn: boolean;
}

export const initialState: IStore = {
  isLoading: false,
  isLoggedIn: false,
};

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const setLoading = createAction<boolean>(ActionTypes.SET_LOADING);
const setLoggedIn = createAction<boolean>(ActionTypes.SET_LOGGED_IN);
const getUser = createAction(ActionTypes.GET_USER);
const login = createAction<UserLoginItem>(ActionTypes.LOGIN);
const logout = createAction(ActionTypes.LOGOUT);

export const Actions = {
  getUser,
  login,
  logout,
};

///////////////////////////////////
// REDUCERS
///////////////////////////////////
export const reducer: Reducer<IStore, AuthActionType> = createReducer(initialState, (builder) =>
  builder
    .addCase(setLoading, (state, {payload}) => ({
      ...state,
      isLoading: payload,
    }))
    .addCase(setLoggedIn, (state, {payload}) => ({
      ...state,
      isLoggedIn: payload,
    })),
);

///////////////////////////////////
// SAGAS
///////////////////////////////////
function* loginFlow(action: PayloadAction<UserLoginItem>) {
  try {
    yield* put(setLoading(true));

    const data = action.payload;

    if (data) {
      const result = yield* call(LoginAPI.signIn, data);
      yield* put(getUser());
    }

    yield* put(setLoading(false));
  } catch (e) {
    yield* put(setLoading(false));
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
  }
}

function* logoutFlow() {
  try {
    yield* put(setLoading(true));

    const result = yield* call(AuthService.logout);
    yield* put(setLoggedIn(false));
    document.cookie = 'expires=0';

    yield* put(setLoading(false));
  } catch (e) {
    yield* put(setLoading(false));
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
  }
}

function* getUserFlow() {
  try {
    const result = yield* call(AuthService.auth);
    if (result) {
      yield* put(setLoggedIn(true));
      yield* put(setUser(result));
    }
  } catch (e) {}
}

export function* authListFlow() {
  yield* takeEvery(getUser, getUserFlow);
  yield* takeEvery(login, loginFlow);
  yield* takeEvery(logout, logoutFlow);
}
