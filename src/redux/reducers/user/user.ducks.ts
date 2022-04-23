import {createAction, PayloadAction} from '@reduxjs/toolkit';
import {call, put, takeEvery} from 'typed-redux-saga';

import {Actions as notificationActions} from '../notification/notification.duck';
import {getExceptionByError} from '../../../utils/notification';
import {CurrentUserItem, UpdateUserInfoType, UserPasswordApiItem} from '../../../models/user.model';
import {UserService} from '../../../services/user.service';
import {setUser} from './user.reducer';
import {Actions as authActions} from '../auth/auth.ducks';

enum ActionTypes {
  UPDATE_INFO = `@user/updateInfo`,
  UPDATE_AVATAR = `@user/updateAvatar`,
  UPDATE_PASSWORD = `@user/updatePassword`,
}

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const updateInfo = createAction<UpdateUserInfoType<CurrentUserItem>>(ActionTypes.UPDATE_INFO);
const updateAvatar = createAction<File>(ActionTypes.UPDATE_AVATAR);
const updatePassword = createAction<UpdateUserInfoType<UserPasswordApiItem>>(ActionTypes.UPDATE_PASSWORD);

export const Actions = {
  updateInfo,
  updateAvatar,
  updatePassword,
};

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
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
  }
}

function* updateAvatarFlow(action: PayloadAction<File>) {
  try {
    const data = action.payload;

    if (data) {
      const result = yield* call(UserService.updateUserAvatar, data);
      yield* put(authActions.getUser());
    }
  } catch (e) {
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
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
    yield* put(notificationActions.setNotification(getExceptionByError(e)));
  }
}

export function* userListFlow() {
  yield* takeEvery(updateInfo, updateInfoFlow);
  yield* takeEvery(updateAvatar, updateAvatarFlow);
  yield* takeEvery(updatePassword, updatePasswordFlow);
}
