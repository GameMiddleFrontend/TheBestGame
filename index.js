const { app } = require('./dist/server.js');

const port = process.env.PORT || 3000;

const {Client} = require('pg');

const client = new Client({
  host: process.env.DATABASE_IP,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
});


client.connect()
  .then(() => {
    console.log('sql connect SUCCESS');
  })
  .catch((err) => {
    console.log('sql connect FAILURE', err);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log('Application is started on localhost:', port);
    });
  })


