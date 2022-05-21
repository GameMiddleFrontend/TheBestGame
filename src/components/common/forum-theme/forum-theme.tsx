import React, {MouseEventHandler, useCallback} from 'react';
import './forum-theme.styles.scss';
import {ForumProps} from './forum-theme.types';

const forumThemeRootClass = 'forum-theme';

function ForumThemeComponent({id, name, lastMessage, lastMessageTime, onCLick}: ForumProps) {
  const onClickHandler: MouseEventHandler<HTMLDivElement> = useCallback((event) => onCLick(event), []);
  return (
    <>
      <div className={forumThemeRootClass} data-id={id} onClick={onClickHandler}>
        <div className={'theme-header'}>
          <div className={'theme-name'}>{name}</div>
          <div className={'theme-time'}>{lastMessageTime}</div>
        </div>
        <div className={'theme-message'}>{lastMessage || '<Здесь пока нет ни одного сообщения>'}</div>
      </div>
    </>
  );
}

export default ForumThemeComponent;
