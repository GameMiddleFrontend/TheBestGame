import {combineReducers} from 'redux';
import {reducer as authReducer} from './auth/auth.ducks';
import {reducer as notificationReducer} from './notification/notification.duck';
import IConfiguredStore from './configured-store';
import UserReducer from './user/user.ducks';
import LeaderboardReducer from './leaderboard/leaderboard.ducks';
import {topicReducer} from '@store/reducers/topic/topic.store';

const reducer = combineReducers<IConfiguredStore>({
  auth: authReducer,
  user: UserReducer,
  leaderboard: LeaderboardReducer,
  notification: notificationReducer,
  topic: topicReducer,
});

export default reducer;
