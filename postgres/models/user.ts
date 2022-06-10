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
  customTheme: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
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

export const includeUser = {model: UserTable, as: 'author', attributes: ['id', 'login', 'display_name', 'avatar']};

export const addUser = async (user: CurrentUserItem) => {
  return await UserTable.create(user);
};

export const updateUserInfo = async (user: CurrentUserItem) => {
  return await getUserById(user.id).then((response: Model<CurrentUserItem, CurrentUserItem> | null) => {
    if (response) {
      return response.update({
        login: user.login,
        email: user.email,
        first_name: user.first_name,
        second_name: user.second_name,
        display_name: user.display_name,
        phone: user.phone,
        avatar: user.avatar,
      });
    }
  });
};

export const createOrUpdateUserIfNotExists = async (user: CurrentUserItem) => {
  return await getUserById(user.id).then((response) => {
    if (!response) {
      return addUser(user);
    }
    return updateUserInfo(user);
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

export const changeUserTheme = async (userId: number) => {
  return await UserTable.findOne({
    where: {
      id: userId,
    },
  }).then((user: Model<CurrentUserItem, CurrentUserItem> | null) => {
    if (user) {
      const newValue = user.getDataValue('customTheme') || false;
      return user.update({customTheme: !newValue});
    }
    return;
  });
};

export default UserTable;
