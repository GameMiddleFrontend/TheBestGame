import {createAction, createReducer, PayloadAction, Reducer} from '@reduxjs/toolkit';
import {call, put, takeEvery, select} from 'typed-redux-saga';
import {BaseActionType} from '@store/redux.base.types';
import ForumTopicModel from '@models/forum-topic.model';
import {Actions as notificationActions} from '@store/reducers/notification/notification.duck';
import {getExceptionByError} from '@utils/notification';
import TopicAPI from '@services/Topic.API';
import ForumComment, {IForumCommentAddParams} from '@models/forum-comment.model';
import IConfiguredStore from '@store/reducers/configured-store';
import {getUserId} from '@store/reducers/user/user.ducks';

enum ActionTypes {
  ON_INIT = `@topicComment/onInit`,

  SET_TOPIC_ID = `@topicComment/setTopicId`,
  SET_DATA = `@topicComment/setData`,

  ADD_COMMENT = `@topicComment/addComment`,
  GET_COMMENTS_DATA = `@topicComment/getCommentsData`,
}

////////////////////////////////////////
// TYPES
////////////////////////////////////////
type TopicCommentActionType = BaseActionType<ActionTypes>;

// ////////////////////////////////////////
// // STORE
// ////////////////////////////////////////
export interface IStore {
  topic: ForumTopicModel;
  comments: ForumComment[];
}

export const initialState: IStore = {
  topic: {
    id: undefined,
    author: {
      id: 0,
      login: '',
    },
    createdAt: '',
    title: '',
    content: '',
  },
  comments: [],
};

/////////////////////////////////////
// SELECTORS
/////////////////////////////////////
const getCurrentTopicId = (state: IConfiguredStore) => state.topic.current.topic.id;

/////////////////////////////////////
// ACTIONS
/////////////////////////////////////
const onInit = createAction<ForumTopicModel['id']>(ActionTypes.ON_INIT);

const setTopicId = createAction<ForumTopicModel['id']>(ActionTypes.SET_TOPIC_ID);
const setData = createAction<IStore>(ActionTypes.SET_DATA);

const addComment = createAction<IForumCommentAddParams>(ActionTypes.ADD_COMMENT);
const getCommentsData = createAction(ActionTypes.GET_COMMENTS_DATA);

export const Actions = {onInit, addComment, getCommentsData};

///////////////////////////////////
// REDUCERS
///////////////////////////////////
export const reducer: Reducer<IStore, TopicCommentActionType> = createReducer(initialState, (builder) =>
  builder
    .addCase(setTopicId, (state, {payload}) => {
      return {
        ...state,
        topic: {
          ...state.topic,
          id: payload,
        },
      };
    })
    .addCase(setData, (state, {payload}) => {
      return {
        ...state,
        ...payload,
      };
    }),
);

///////////////////////////////////
// SAGAS
///////////////////////////////////
function* onInitFlow(action: PayloadAction<ForumTopicModel['id']>) {
  try {
    const topicId = action.payload;

    if (topicId !== undefined) {
      yield* put(setTopicId(topicId));
      yield* put(getCommentsData());
    }
  } catch (error) {
    yield* put(notificationActions.setNotification(getExceptionByError(error as Error)));
  }
}

function* getCommentsDataFlow() {
  try {
    const topicId = yield* select(getCurrentTopicId);

    if (topicId !== undefined) {
      const result = yield* call(TopicAPI.getTopicComments, topicId);
      yield* put(setData(result));
    }
  } catch (error) {
    yield* put(notificationActions.setNotification(getExceptionByError(error as Error)));
  }
}

function* addCommentFlow(action: PayloadAction<IForumCommentAddParams>) {
  try {
    const data = action.payload;
    const topicId = yield* select(getCurrentTopicId);
    const authorId = yield* select(getUserId);

    if (topicId !== undefined && authorId !== undefined && data !== undefined) {
      const result = yield* call(TopicAPI.addTopicComment, topicId, {...data, authorId});
      yield* put(getCommentsData());
    }
  } catch (error) {
    yield* put(notificationActions.setNotification(getExceptionByError(error as Error)));
  }
}

export function* topicCommentsFlow() {
  yield* takeEvery(onInit, onInitFlow);
  yield* takeEvery(addComment, addCommentFlow);
  yield* takeEvery(getCommentsData, getCommentsDataFlow);
}
