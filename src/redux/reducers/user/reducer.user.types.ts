import {CurrentUserItem} from '../../../models/current-user.model';
import {BaseActionType, Nullable} from '../../redux.base.types';

type LoadStatus = 'success' | 'pending' | 'failed';

type UserState = {
  item: Nullable<CurrentUserItem>;
  status: LoadStatus;
};

enum UserActions {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  SET_USER_ITEM = 'SET_USER_ITEM',
}

interface UserActionType extends BaseActionType<UserActions> {
  item: Nullable<CurrentUserItem>;
}

export {UserActionType, UserState, UserActions};
