import {IStore as INotificationStore} from './notification/notification.duck';
import {IStore as IAuthStore} from './auth/auth.ducks';
import {UserState} from './user/user.ducks';

type IConfiguredStore = {
  auth: IAuthStore;
  user: UserState;
  notification: INotificationStore;
};

export default IConfiguredStore;
