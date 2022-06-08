import {UserItem} from '@models/user.model';
import ForumComment from '@models/forum-comment.model';

type ForumTopicModel = {
  id?: number;
  title: string;
  content: string;
  author: UserItem;
  comments?: Array<ForumComment>;
};

export type ForumTopicDBModel = Omit<ForumTopicModel, 'author' | 'comments'> & {
  author: number;
};

export default ForumTopicModel;
