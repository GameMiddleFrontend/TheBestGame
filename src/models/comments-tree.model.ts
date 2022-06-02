import ForumTopic from '@models/forum-comment.model';
import ForumComment from '@models/forum-comment.model';

type CommentsTree = {
  comment: ForumComment;
  parentTopic: ForumTopic;
  parentComment?: ForumComment;
};

export default CommentsTree;
