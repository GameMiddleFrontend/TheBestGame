import {combineReducers} from 'redux';

import {topicReducer as topicListReducer, ITopicStore as ITopicListStore} from './topic-list.ducks';
import {reducer as currentTopicReducer, IStore as ICurrentTopicStore} from './topic-comment.ducks';

export const topicReducer = combineReducers({
  list: topicListReducer,
  current: currentTopicReducer,
});

export type ITopicStore = {
  list: ITopicListStore;
  current: ICurrentTopicStore;
};
