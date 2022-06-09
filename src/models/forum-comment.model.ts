import {UserItem} from '@models/user.model';
import ForumTopicModel from '@models/forum-topic.model';

type ForumComment = {
  id: number;
  content: string;
  author: UserItem;
  topicId: number;
  createdAt?: string;
  parentComment?: ForumComment;
};

export type ForumCommentDBModel = {
  content: ForumComment['content'];
  authorId: number;
  ForumCommentId: number;
};

export type ForumCommentResponseModel = {
  topic: ForumTopicModel;
  comments: ForumComment[];
};

export type IForumCommentAddParams = {
  content: ForumComment['content'];
};

export default ForumComment;
