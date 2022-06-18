import ForumComment from '@models/forum-comment.model';

export type ForumCommentItemProps = ForumComment & {
  className?: string;
};

export type ForumCommentItemHandlers = {
  setReplyComment?(comment: ForumComment): void;
};
