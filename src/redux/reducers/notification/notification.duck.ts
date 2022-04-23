import {createAction, createReducer, Reducer} from '@reduxjs/toolkit';
import {INotification, INotificationType} from '../../../models/notification.model';
import {BaseActionType} from '../../redux.base.types';

enum ActionTypes {
  SET_NOTIFICATION = `@notification/setNotification`,
}

////////////////////////////////////////
// TYPES
////////////////////////////////////////
type NotificationActionType = BaseActionType<ActionTypes.SET_NOTIFICATION>;

////////////////////////////////////////
// STORE
////////////////////////////////////////
export type IStore = INotification;

export const initialState: IStore = {
  message: '',
  title: '',
  type: INotificationType.EMPTY,
};

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const setNotification = createAction<INotification>(ActionTypes.SET_NOTIFICATION);

export const Actions = {
  setNotification,
};

///////////////////////////////////
// REDUCERS
///////////////////////////////////
export const reducer: Reducer<IStore, NotificationActionType> = createReducer(initialState, (builder) => {
  builder.addCase(setNotification, (state, {payload}) => ({
    ...state,
    ...payload,
  }));
});
