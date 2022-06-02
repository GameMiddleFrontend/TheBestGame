const {app, dbConnect} = require('./dist/server.js');

const port = process.env.PORT || 3000;

dbConnect().finally(() => {
  app.listen(port, () => {
    console.log('Application is started on localhost:', port);
  });
});
