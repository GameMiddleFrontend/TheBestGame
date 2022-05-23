import {combineReducers} from 'redux';
import {reducer as authReducer} from './auth/auth.ducks';
import {reducer as notificationReducer} from './notification/notification.duck';
import IConfiguredStore from './configured-store';
import UserReducer from './user/user.ducks';

const reducer = combineReducers<IConfiguredStore>({
  auth: authReducer,
  user: UserReducer,
  notification: notificationReducer,
});

export default reducer;
