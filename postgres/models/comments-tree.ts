import sequelize from '../sequelize';
import {ModelAttributes, ModelOptions} from 'sequelize';
import {DataType, Model} from 'sequelize-typescript';
import CommentsTree from '@models/comments-tree.model';
import Topic from './forum-topic';
import Comment from './forum-comment';

const ForumTreeDatabaseModel: ModelAttributes<Model, CommentsTree> = {
  comment: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: Comment,
    },
  },
  parentTopic: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: Topic,
    },
  },
  parentComment: {
    type: DataType.INTEGER,
    allowNull: true,
    references: {
      model: Comment,
    },
  },
};

const CommentsTreeModelOptions: ModelOptions = {
  createdAt: false,
  updatedAt: false,
  tableName: 'comment_tree',
  indexes: [
    {
      name: 'parentTopicRelIndex',
      fields: ['parentTopic'],
    },
    {
      name: 'parentCommentRelIndex',
      fields: ['parentComment'],
    },
  ],
};

const CommentTreeTable = sequelize.define('CommentsTree', ForumTreeDatabaseModel, CommentsTreeModelOptions);

export const addBranch = async (branch: CommentsTree) => {
  await CommentTreeTable.create(branch);
};

export default CommentTreeTable;
