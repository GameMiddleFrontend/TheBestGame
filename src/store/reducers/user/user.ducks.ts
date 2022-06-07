import {createAction, createReducer, PayloadAction, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery} from 'typed-redux-saga';

import {Actions as notificationActions} from '../notification/notification.duck';
import {getExceptionByError} from '@utils/notification';
import {CurrentUserItem, UpdateUserInfoType, UserPasswordApiItem} from '@models/user.model';
import {UserService} from '@services/user.service';
import {Actions as AuthActions} from '@store/reducers/auth/auth.ducks';
import {BaseActionType, Nullable} from '@store/redux.base.types';
import AuthService from '@services/auth.service';
import IConfiguredStore from '@store/reducers/configured-store';

enum ActionTypes {
  SET_USER = `@user/setUser`,
  GET_USER = `@user/getUser`,
  UPDATE_INFO = `@user/updateInfo`,
  UPDATE_AVATAR = `@user/updateAvatar`,
  UPDATE_PASSWORD = `@user/updatePassword`,
}

type UserActionType = BaseActionType<ActionTypes>;

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const getUser = createAction(ActionTypes.GET_USER);
const setUser = createAction<CurrentUserItem>(ActionTypes.SET_USER);
const updateInfo = createAction<UpdateUserInfoType<CurrentUserItem>>(ActionTypes.UPDATE_INFO);
const updateAvatar = createAction<File>(ActionTypes.UPDATE_AVATAR);
const updatePassword = createAction<UpdateUserInfoType<UserPasswordApiItem>>(ActionTypes.UPDATE_PASSWORD);

export const Actions = {
  getUser,
  setUser,
  updateInfo,
  updateAvatar,
  updatePassword,
};

export type UserState = {
  item: Nullable<CurrentUserItem>;
};

const initialState: UserState = {item: null};

/////////////////////////////////////
// SELECTORS
/////////////////////////////////////
export const getUserItem = (state: IConfiguredStore) => state.user.item;

/////////////////////////////////////
// REDUCER
/////////////////////////////////////
const UserReducer: Reducer<UserState, UserActionType> = createReducer(initialState, (builder) =>
  builder
    .addCase(setUser, (state, {payload}) => {
      return {
        ...state,
        item: payload,
      };
    })
    .addDefaultCase((state) => {
      return state;
    }),
);

///////////////////////////////////
// SAGAS
///////////////////////////////////
function* updateInfoFlow(action: PayloadAction<UpdateUserInfoType<CurrentUserItem>>) {
  try {
    const {data, callback} = action.payload;

    if (data) {
      const result = yield* call(UserService.setUserInfo, data);
      if (result) {
        yield* put(setUser(result));
      }
      if (callback) {
        callback();
      }
    }
  } catch (e) {
    yield* put(notificationActions.setNotification(getExceptionByError(e as Error)));
  }
}

function* updateAvatarFlow(action: PayloadAction<File>) {
  try {
    const data = action.payload;

    if (data) {
      const result = yield* call(UserService.updateUserAvatar, data);
      yield* put(getUser());
    }
  } catch (e) {
    yield* put(notificationActions.setNotification(getExceptionByError(e as Error)));
  }
}

function* updatePasswordFlow(action: PayloadAction<UpdateUserInfoType<UserPasswordApiItem>>) {
  try {
    const {data, callback} = action.payload;

    if (data) {
      const result = yield* call(UserService.setUserPassword, data);
      if (callback) {
        callback();
      }
    }
  } catch (e) {
    yield* put(notificationActions.setNotification(getExceptionByError(e as Error)));
  }
}

function* getUserFlow() {
  try {
    const result = yield* call(AuthService.auth);
    if (result) {
      yield* put(AuthActions.setLoggedIn(true));
      yield* put(setUser(result));
    }
  } catch (e) {}
}

export function* userListFlow() {
  yield* takeEvery(getUser, getUserFlow);
  yield* takeEvery(updateInfo, updateInfoFlow);
  yield* takeEvery(updateAvatar, updateAvatarFlow);
  yield* takeEvery(updatePassword, updatePasswordFlow);
}

export default UserReducer;
