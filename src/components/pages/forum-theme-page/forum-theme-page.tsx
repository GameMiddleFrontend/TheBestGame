import React, {ChangeEvent, FC, KeyboardEvent, useCallback, useEffect, useState} from 'react';
import withAuth from '@hooks/chechAuthHookHOC';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Actions as topicCommentActions, IStore as ITopicCommentStore} from '@store/reducers/topic/topic-comment.ducks';
import ForumThemeComponent from '@components/forum/forum-theme';
import IConfiguredStore from '@store/reducers/configured-store';
import ForumCommentItem from '@components/forum/forum-comment-item/forum-comment-item.component';

import './forum-theme-page.styles.scss';

type IMatchParams = {
  threadId: string;
};

function ForumThemePage() {
  const {topic, comments} = useSelector<IConfiguredStore, ITopicCommentStore>((state) => state.topic.current);
  const dispatch = useDispatch();
  const params = useParams<IMatchParams>();

  const [message, setMessage] = useState('');

  useEffect(() => {
    params.threadId && dispatch(topicCommentActions.onInit(+params.threadId));
  }, []);

  const handleMessageKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (message) {
          dispatch(topicCommentActions.addComment({content: message}));
          setMessage('');
        }
      }
    },
    [message],
  );

  const handleChangeMessage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  return (
    <div className="page-container forum-theme-page">
      <ForumThemeComponent {...topic} />
      <div className={'forum-page-comments'}>
        {comments.map((commentItem) => {
          return <ForumCommentItem {...commentItem} key={commentItem.id} />;
        })}
      </div>
      <div className={'forum-page-message'}>
        <input
          placeholder={'Ответить'}
          value={message}
          onChange={handleChangeMessage}
          onKeyDown={handleMessageKeyDown}
        />
      </div>
    </div>
  );
}

const ForumThemePageHOC = withAuth(ForumThemePage);

export default ForumThemePageHOC;
