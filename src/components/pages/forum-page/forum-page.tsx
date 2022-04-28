import React, {MouseEventHandler, useEffect, useMemo, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {compose} from 'redux';

import {IForumTheme} from '../../common/forum-theme/forum-theme.types';
import ForumAPI from '../../../services/forumAPI';
import ForumThemeComponent from '../../common/forum-theme';
import withAuth from '../../../hooks/chechAuthHookHOC';

import './forum-page.styles.scss';

import './forum-page.styles.scss';

function ForumPage() {
  const [themes, setThemes] = useState<IForumTheme[]>([]);
  const [filterValue, setFilterValue] = useState<string>('');
  const navigate = useNavigate();

  const onThemeClick = (event: MouseEventHandler<HTMLDivElement> | undefined) => {
    const target = (event as unknown as MouseEvent).target;
    const id: string | undefined = (target as HTMLDivElement).dataset.id;
    if (id !== undefined) {
      navigate(id);
    }
  };

  const onCreateThemeClick = () => {
    //TODO
  };

  const onFiltredValueChange = (event: {target: {value: React.SetStateAction<string>}}) => {
    setFilterValue(event.target.value);
  };

  useEffect(() => {
    ForumAPI.getThemes()
      .then((newThemes: IForumTheme[]): void => {
        setThemes(newThemes);
      })
      .catch((err: Error) => {
        console.log(err.message);
      });
  }, [themes]);

  const page = useMemo(() => {
    return (
      <>
        <div className={'forum-label'}>Форум</div>
        <div className={'find-theme-container'}>
          <input
            className={'find-theme-item find-theme-input'}
            placeholder={'Найти'}
            onChange={onFiltredValueChange}
            value={filterValue}
          />
        </div>
        <div className={'add-theme-container'}>
          <input className={'add-theme-item add-theme-input'} placeholder={'Тема'} />
          <button className={'add-theme-item add-theme-button'} onClick={onCreateThemeClick}>
            Создать
          </button>
        </div>
        <div className={'forum-content'}>
          {themes && themes.length
            ? themes.map((theme: IForumTheme) => {
                if (!filterValue || (filterValue && theme.name.includes(filterValue))) {
                  return <ForumThemeComponent key={theme.id} {...theme} onCLick={onThemeClick} />;
                }
              })
            : null}
        </div>
      </>
    );
  }, [themes, filterValue]);

  return <div className={'page-container forum-page-container'}>{page}</div>;
}

const ForumPageHOC = compose(withAuth(ForumPage));

export default ForumPageHOC;
