import {Client} from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'game-base',
  password: 'newPassword',
  port: 5432,
});

client.connect();

export default client
  .query('SELECT NOW()')
  .then((res) => {
    console.log(res.rows);
    client.end();
  })
  .catch((err) => {
    console.log('error', err);
  });
