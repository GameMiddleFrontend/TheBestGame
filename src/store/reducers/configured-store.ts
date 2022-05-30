import {IStore as INotificationStore} from './notification/notification.duck';
import {IStore as IAuthStore} from './auth/auth.ducks';
import {IStore as ILeaderboardStore} from './leaderboard/leaderboard.ducks';
import {UserState} from './user/user.ducks';

type IConfiguredStore = {
  auth: IAuthStore;
  user: UserState;
  leaderboard: ILeaderboardStore;
  notification: INotificationStore;
};

export default IConfiguredStore;
