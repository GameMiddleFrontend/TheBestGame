import {fork} from 'redux-saga/effects';
import {setTopicsFlow as topicListFlow} from './topic-list.ducks';
import {topicCommentsFlow} from './topic-comment.ducks';

export function* topicFlow() {
  yield fork(topicListFlow);
  yield fork(topicCommentsFlow);
}
