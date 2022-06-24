import sequelize from './sequelize';

export default async function dbConnect() {
  console.log('-----------DB CONNECT-----------');
  try {
    await sequelize.authenticate();
    await sequelize.sync({force: true});
    console.log('SQL Connection has been established successfully.');
  } catch (error) {
    console.error('SQL Unable to connect to the database:', error);
  }
}
