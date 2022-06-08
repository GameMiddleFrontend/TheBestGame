import {UserItem} from '@models/user.model';
import ForumComment from '@models/forum-comment.model';

type ForumTopicModel = {
  id?: number;
  title: string;
  content: string;
  author: UserItem;
  createdAt: string;
  comments?: Array<ForumComment>;
};

export type ForumTopicDBModel = Omit<ForumTopicModel, 'author' | 'comments' | 'createdAt'> & {
  authorId: number;
};

export default ForumTopicModel;
