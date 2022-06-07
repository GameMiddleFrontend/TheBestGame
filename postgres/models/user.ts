import {DataType, Model} from 'sequelize-typescript';
import {ModelAttributes, ModelOptions} from 'sequelize/types';
import {CurrentUserItem} from '@models/user.model';
import sequelize from '../sequelize';

const userDatabaseModel: ModelAttributes<Model, CurrentUserItem> = {
  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  login: {
    type: DataType.STRING,
    allowNull: false,
  },
  email: {
    type: DataType.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataType.STRING,
    allowNull: false,
  },
  second_name: {
    type: DataType.STRING,
    allowNull: false,
  },
  display_name: {
    type: DataType.STRING,
    allowNull: true,
  },
  phone: {
    type: DataType.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataType.STRING,
    allowNull: true,
  },
};

const userModelOptions: ModelOptions = {
  createdAt: true,
  updatedAt: true,
  tableName: 'gamers',
  indexes: [
    {
      name: 'primaryColumnIndex',
      type: 'UNIQUE',
      unique: true,
      fields: ['id'],
    },
  ],
};

const UserTable = sequelize.define('User', userDatabaseModel, userModelOptions);

export const addUser = async (user: CurrentUserItem) => {
  await UserTable.create(user);
};

export const createUserIfNotExists = async (user: CurrentUserItem) => {
  return await getUserById(user.id).then((response) => {
    console.log(response);
    if (!response) {
      addUser(user);
    }
  });
};

export const getUserById = async (userId: number) => {
  return await UserTable.findOne({
    where: {
      id: userId,
    },
  });
};

export const getUsers = async () => {
  return await UserTable.findAll({});
};

export default UserTable;
