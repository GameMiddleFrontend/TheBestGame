import React, {MouseEventHandler, useCallback} from 'react';
import './forum-theme.styles.scss';
import {ForumProps} from './forum-theme.types';

function ForumThemeComponent({id, title, content, onCLick}: ForumProps) {
  const onClickHandler: MouseEventHandler<HTMLDivElement> = useCallback((event) => onCLick && onCLick(event), []);
  return (
    <>
      <div className={'forum-theme'} data-id={id} onClick={onClickHandler}>
        <div className={'theme-header'}>
          <div className={'theme-name'}>{title}</div>
        </div>
        <div className={'theme-message'}>{content || '<Здесь пока нет ни одного сообщения>'}</div>
      </div>
    </>
  );
}

export default ForumThemeComponent;
