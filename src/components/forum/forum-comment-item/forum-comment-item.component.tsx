import React, {FC} from 'react';
import {ForumCommentItemProps} from '@components/forum/forum-comment-item/forum-comment-item.types';
import AvatarComponent from '@common/avatar';

import './forum-comment-item.styles.scss';

const ForumCommentItem: FC<ForumCommentItemProps> = (props) => {
  return (
    <div className={'forum-comment-item'}>
      <AvatarComponent className={'avatar-sm'} imgSrc={props.author.avatar} />
      <div className={'comment-body'}>
        <div className={'comment-header'}>
          <div className={'comment-header-user'}>{props.author.display_name || props.author.login}</div>
          {/*<div className={'comment-header-time'}>{'16:21'}</div>*/}
        </div>
        <div className={'comment-content'}>{props.content}</div>
      </div>
    </div>
  );
};

export default ForumCommentItem;
