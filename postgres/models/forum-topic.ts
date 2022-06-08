import sequelize from '../sequelize';
import {ModelAttributes, ModelOptions} from 'sequelize';
import {DataType, Model} from 'sequelize-typescript';
import {ForumTopicDBModel} from '@models/forum-topic.model';
import UserTable, {includeUser} from './user';

export const ForumTopicDatabaseModel: ModelAttributes<Model<ForumTopicDBModel>, Omit<ForumTopicDBModel, 'authorId'>> = {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataType.STRING,
    allowNull: false,
  },
  content: {
    type: DataType.STRING,
    allowNull: false,
  },
};

const ForumTopicModelOptions: ModelOptions = {
  createdAt: true,
  updatedAt: true,
  tableName: 'topic',
  indexes: [
    {
      name: 'primaryTopicIndex',
      type: 'UNIQUE',
      unique: true,
      fields: ['id'],
    },
  ],
};

const TopicTable = sequelize.define('Topic', ForumTopicDatabaseModel, ForumTopicModelOptions);

UserTable.hasMany(TopicTable, {foreignKey: 'authorId'});
TopicTable.belongsTo(UserTable, {as: 'author', foreignKey: 'authorId'});

export const addTopic = async (topic: ForumTopicDBModel) => {
  delete topic.id;
  await TopicTable.create(topic);
};

export const getDBTopics = async (limit?: number, offset?: number) => {
  return await TopicTable.findAll({
    limit: limit,
    offset: offset,
    include: [includeUser],
    attributes: {
      exclude: ['authorId'],
    },
  });
};

export const getTopicById = async (topicId: number) => {
  return await TopicTable.findOne({
    where: {
      id: topicId,
    },
    include: [includeUser],
    attributes: {
      exclude: ['authorId'],
    },
  });
};

export default TopicTable;
