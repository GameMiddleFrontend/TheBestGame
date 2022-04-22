import {UserActions, UserActionType, UserState} from './reducer.user.types';
import {CaseReducer, createAction, createReducer} from '@reduxjs/toolkit';
import {BaseActionType} from '../../redux.base.types';

const initialState: UserState = {
  status: 'failed',
  item: null,
};

const pendingUserAction = createAction<UserState, UserActions>(UserActions.PENDING);
const successUserAction = createAction<UserState, UserActions>(UserActions.SUCCESS);
const failedUserAction = createAction<UserState, UserActions>(UserActions.FAILED);
const setUserAction = createAction<UserState, UserActions>(UserActions.SET_USER_ITEM);

const userReducer: CaseReducer = createReducer<UserState>(initialState, (builder) => {
  builder
    .addCase(pendingUserAction, (state) => {
      return {
        ...state,
        status: 'pending',
      };
    })
    .addCase(successUserAction, (state) => {
      return {
        ...state,
        status: 'success',
      };
    })
    .addCase(failedUserAction, (state) => {
      return {
        ...state,
        status: 'failed',
      };
    })
    .addCase(setUserAction, (state, {payload: user}) => {
      return {
        ...state,
        user,
      };
    })
    .addDefaultCase((state) => {
      return state;
    });
});

export function loadSuccess(): BaseActionType<UserActions> {
  return {type: UserActions.SUCCESS};
}
export function loadFailed(): BaseActionType<UserActions> {
  return {type: UserActions.FAILED};
}
export function loadPending(): BaseActionType<UserActions> {
  return {type: UserActions.PENDING};
}

export function setUser(user: UserActionType['item']): UserActionType {
  return {type: UserActions.SET_USER_ITEM, item: user};
}

export {userReducer as default};
