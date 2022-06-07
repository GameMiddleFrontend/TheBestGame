import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {compose} from 'redux';

import ForumThemeComponent from '@common/forum-theme';
import withAuth from '@hooks/chechAuthHookHOC';

import './forum-page.styles.scss';

import './forum-page.styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import IConfiguredStore from '@store/reducers/configured-store';
import {ITopicStore, topicActions} from '@store/reducers/topic/topic.ducks';
import ForumTopicModel, {ForumTopicDBModel} from '@models/forum-topic.model';
import FormComponent from '@common/form/form.component';
import {CreateTheme, CreateThemeDef} from '@pages/forum-page/forum-page.types';
import TopicAPI from '@services/Topic.API';
import {UserState} from '@store/reducers/user/user.ducks';

//TODO Сделать постраничное отображение

function ForumPage() {
  const {items: topics} = useSelector<IConfiguredStore, ITopicStore>((state) => state.topics);
  const {item: currentUser} = useSelector<IConfiguredStore, UserState>((state) => state.user);
  const dispatch = useDispatch();
  const [filterValue, setFilterValue] = useState<string>('');
  const navigate = useNavigate();

  const onThemeClick = (event: unknown) => {
    const target = (event as MouseEvent).target;
    const id: string | undefined = (target as HTMLDivElement).dataset.id;
    if (id !== undefined) {
      navigate(id);
    }
  };

  const onFiltredValueChange = (event: {target: {value: React.SetStateAction<string>}}) => {
    setFilterValue(event.target.value);
  };

  const onCreateThemeSubmit = useCallback((data: CreateTheme) => {
    const topicData: ForumTopicDBModel = {
      title: data.title,
      content: data.content,
      author: currentUser!.id,
    };
    TopicAPI.addTopic(topicData)
      .then(() => {
        dispatch(topicActions.getTopics());
      })
      .catch((error: Error) => console.log(error.message));
  }, []);

  useEffect(() => {
    dispatch(topicActions.getTopics());
  }, []);

  return (
    <div className={'page-container forum-page-container'}>
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
        <FormComponent
          formElementsDef={CreateThemeDef}
          isEditMode={true}
          submitText={'Создать'}
          onSubmit={onCreateThemeSubmit}
        />
      </div>
      <div className={'forum-content'}>
        {topics.map((theme: ForumTopicModel) => {
          if (!filterValue || (filterValue && theme.title.includes(filterValue))) {
            return <ForumThemeComponent key={theme.id} {...theme} onCLick={onThemeClick} />;
          }
        })}
      </div>
    </div>
  );
}

const ForumPageHOC = compose(withAuth(ForumPage));

export default ForumPageHOC;
