import {UserState} from './reducers/user/user.reducer.types';

export type Nullable<T> = T | null;

export interface BaseActionType<T> {
  type: T;
}

export type MainStoreType = {
  user: UserState;
};
