import {fork} from 'redux-saga/effects';
import {authListFlow} from './auth/auth.ducks';
import {userListFlow} from './user/user.ducks';

export default function* () {
  yield fork(authListFlow);
  yield fork(userListFlow);
}
