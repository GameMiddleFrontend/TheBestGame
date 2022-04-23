import {createAction, createReducer, PayloadAction, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery} from 'typed-redux-saga';

import {BaseActionType} from '../../redux.base.types';
import LoginAPI from '../../../services/loginAPI';
import {Actions as notificationActions} from '../notification/notification.duck';
import {getExceptionByError} from '../../../utils/notification';
import {UserLoginItem} from '../../../models/current-user.model';

enum ActionTypes {
  SET_LOADING = `@auth/setLoading`,
  LOGIN = `@auth/login`,
}
////////////////////////////////////////
// TYPES
////////////////////////////////////////
type AuthActionType = BaseActionType<ActionTypes.SET_LOADING>;

// ////////////////////////////////////////
// // STORE
// ////////////////////////////////////////
export interface IStore {
  isLoading: boolean;
}

export const initialState: IStore = {
  isLoading: false,
};

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const setLoading = createAction<boolean>(ActionTypes.SET_LOADING);
const login = createAction<UserLoginItem>(ActionTypes.LOGIN);

export const Actions = {
  setLoading,
  login,
};

///////////////////////////////////
// REDUCERS
///////////////////////////////////
export const reducer: Reducer<IStore, AuthActionType> = createReducer(initialState, (builder) =>
  builder.addCase(setLoading, (state, {payload}) => ({
    ...state,
    isLoading: payload,
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
    }

    yield* put(setLoading(false));
  } catch (e) {
    yield* put(setLoading(false));
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
  }
}

export function* authListFlow() {
  yield takeEvery(login, loginFlow);
}
