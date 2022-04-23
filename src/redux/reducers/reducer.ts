import {combineReducers} from 'redux';
import userReducer from './user';
import {reducer as authReducer} from './auth/auth.ducks';
import {reducer as notificationReducer} from './notification/notification.duck';
import IConfiguredStore from './configured-store';

const reducer = combineReducers<IConfiguredStore>({
  auth: authReducer,
  user: userReducer,
  notification: notificationReducer,
});

export default reducer;
