import React, {MouseEventHandler, useCallback} from 'react';
import {ForumProps} from './forum-theme.types';

import './forum-theme.styles.scss';

function ForumThemeComponent({id, title, content, author, createdAt, onCLick}: ForumProps) {
  const onClickHandler: MouseEventHandler<HTMLDivElement> = useCallback((event) => onCLick && onCLick(event), []);

  const date = new Date(createdAt);
  const dateFormat = date.toLocaleString('ru-RU');

  return (
    <div className={'forum-theme'} data-id={id}>
      <img src={'/images/message.svg'} className="icon icon-message" role="img" />
      <div className={'theme-content'}>
        <div className={'theme-header'}>
          <h4 className={'theme-name'} onClick={onClickHandler}>
            {title}
          </h4>
        </div>
        <div className={'theme-message'}>{content || '<Здесь пока нет ни одного сообщения>'}</div>
      </div>
      <div className={'theme-data'}>
        <span className={'theme-author'}>{'Автор: '.concat(author?.display_name || author?.login)}</span>
        <span className={'theme-date'}>{dateFormat}</span>
      </div>
    </div>
  );
}

export default ForumThemeComponent;
