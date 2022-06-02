import {CurrentUserItem} from '@models/user.model';
import ForumComment from '@models/forum-comment.model';

type ForumTopicModel = {
  id: number;
  title: string;
  content: string;
  author: CurrentUserItem;
  comments?: Array<ForumComment>;
};

export default ForumTopicModel;
