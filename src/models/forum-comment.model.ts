import {CurrentUserItem} from '@models/user.model';

type ForumComment = {
  id: number;
  content: string;
  author: CurrentUserItem;
  comments?: Array<ForumComment>;
};

export default ForumComment;
