import {createAction, createReducer, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery} from 'typed-redux-saga';
import {BaseActionType} from '@store/redux.base.types';
import ForumTopicModel from '@models/forum-topic.model';
import {Actions as notificationActions} from '@store/reducers/notification/notification.duck';
import {getExceptionByError} from '@utils/notification';
import TopicAPI from '@services/Topic.API';

enum TopicActionTypes {
  SET_TOPICS = `@topic/setTopics`,
  GET_TOPICS = `@topic/getTopics`,
}

////////////////////////////////////////
// TYPES
////////////////////////////////////////

type TopicActionType = BaseActionType<TopicActionTypes>;

// ////////////////////////////////////////
// // STORE
// ////////////////////////////////////////

export interface ITopicStore {
  items: ForumTopicModel[];
}

export const initialState: ITopicStore = {
  items: [],
};

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////

const setTopics = createAction<ForumTopicModel[]>(TopicActionTypes.SET_TOPICS);
const getTopics = createAction(TopicActionTypes.GET_TOPICS);

export const topicActions = {getTopics, setTopics};

///////////////////////////////////
// REDUCERS
///////////////////////////////////
export const topicReducer: Reducer<ITopicStore, TopicActionType> = createReducer(initialState, (builder) =>
  builder
    .addCase(setTopics, (state, {payload}) => {
      return {
        ...state,
        items: payload,
      };
    })
    .addDefaultCase((state) => {
      return state;
    }),
);

///////////////////////////////////
// SAGAS
///////////////////////////////////

function* getTopicsFlow() {
  try {
    const topics = yield* call(TopicAPI.getTopics);
    yield* put(setTopics(topics));
  } catch (error) {
    yield* put(setTopics([]));
    yield* put(notificationActions.setNotification(getExceptionByError(error as Error)));
  }
}

export function* setTopicsFlow() {
  yield* takeEvery(getTopics, getTopicsFlow);
}

export default topicReducer;
