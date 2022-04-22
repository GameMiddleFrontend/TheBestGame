import {UserState} from './reducers/user/reducer.user.types';

export type Nullable<T> = T | null;

export interface BaseActionType<T> {
  type: T;
}

export type MainStoreType = {
  user: UserState;
};
