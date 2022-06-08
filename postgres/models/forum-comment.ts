import sequelize from '../sequelize';
import {ModelAttributes, ModelOptions} from 'sequelize';
import {DataType, Model} from 'sequelize-typescript';
import ForumComment from '@models/forum-comment.model';
import TopicTable from '@postgres/models/forum-topic';
import UserTable, {includeUser} from './user';

const ForumCommentDatabaseModel: ModelAttributes<Model, Omit<ForumComment, 'topicId' | 'author'>> = {
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

TopicTable.hasMany(CommentTable, {foreignKey: 'topicId', onDelete: 'CASCADE'});

UserTable.hasMany(CommentTable, {foreignKey: 'authorId'});
CommentTable.belongsTo(UserTable, {as: 'author', foreignKey: 'authorId'});

export const addComment = async (comment: ForumComment) => {
  return await CommentTable.create(comment);
};

export const getDBCommentsByTopicId = async (topicId: number, limit?: number, offset?: number) => {
  return await CommentTable.findAll({
    limit: limit,
    offset: offset,
    where: {
      topicId: topicId,
    },
    include: [includeUser],
    attributes: {
      exclude: ['authorId'],
    },
  });
};

export default CommentTable;
