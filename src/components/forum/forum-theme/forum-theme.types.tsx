import {MouseEventHandler} from 'react';
import ForumTopicModel from '@models/forum-topic.model';

interface IForumThemeEvents {
  onCLick?: MouseEventHandler<HTMLDivElement>;
}

type ForumProps = ForumTopicModel & IForumThemeEvents;

export {ForumProps};
