import sequelize from '../sequelize';
import {ModelAttributes, ModelOptions} from 'sequelize';
import {DataType, Model} from 'sequelize-typescript';
import User from './user';
import ForumComment from '@models/forum-comment.model';
import TopicTable from './forum-topic';

const ForumCommentDatabaseModel: ModelAttributes<Model, ForumComment> = {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  content: {
    type: DataType.STRING,
    allowNull: false,
  },
  author: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: User,
    },
  },
};

const ForumCommentModelOptions: ModelOptions = {
  createdAt: true,
  updatedAt: true,
  tableName: 'comment',
  indexes: [
    {
      name: 'primaryCommentIndex',
      type: 'UNIQUE',
      unique: true,
      fields: ['id'],
    },
  ],
};

const CommentTable = sequelize.define('Comment', ForumCommentDatabaseModel, ForumCommentModelOptions);

export const addComment = async (comment: ForumComment) => {
  await CommentTable.create(comment);
};

export default CommentTable;
