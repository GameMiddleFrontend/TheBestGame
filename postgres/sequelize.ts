import {Sequelize, SequelizeOptions} from 'sequelize-typescript';

const sequelizeOptions: SequelizeOptions = {
  host: process.env.DATABASE_IP,
  port: process.env.DATABASE_PORT as unknown as number,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  dialect: 'postgres',
};

export default new Sequelize(sequelizeOptions);
