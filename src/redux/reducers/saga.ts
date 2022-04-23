import {fork} from 'redux-saga/effects';
import {authListFlow} from './auth/auth.ducks';

export default function* () {
  yield fork(authListFlow);
}
