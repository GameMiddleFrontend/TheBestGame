import React, {FC, useCallback} from 'react';
import {
  ForumCommentItemHandlers,
  ForumCommentItemProps,
} from '@components/forum/forum-comment-item/forum-comment-item.types';
import AvatarComponent from '@common/avatar';
import Button from '@common/button';

import './forum-comment-item.styles.scss';

const ForumCommentItem: FC<ForumCommentItemProps & ForumCommentItemHandlers> = (props) => {
  const date = props.createdAt ? new Date(props.createdAt) : null;
  const dateFormat = date?.toLocaleString('ru-RU');

  const onClickReply = useCallback(() => {
    props.setReplyComment && props.setReplyComment(props);
  }, [props]);

  return (
    <div className={`forum-comment-item ${props.className ? props.className : ''}`}>
      <AvatarComponent className={'avatar-sm'} imgSrc={props.author?.avatar} />
      <div className={'comment-body'}>
        <div className={'theme-data comment-header'}>
          <div className={'comment-header-user'}>{props.author.display_name || props.author.login}</div>
          {dateFormat && <div className={'comment-header-time'}>{dateFormat}</div>}
        </div>
        {props.parentComment && <ForumCommentItem className={'parent-comment'} {...props.parentComment} />}
        <div className={'comment-content'}>{props.content}</div>
      </div>
      <Button className={'button-icon-only button-reply'} icon={'/images/reply.svg'} onClick={onClickReply} />
    </div>
  );
};

export default ForumCommentItem;
