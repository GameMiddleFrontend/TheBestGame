const {app, dbConnect} = require('./dist/server.js');
const https = require('https');
const selfSignedCert = require('openssl-self-signed-certificate');

const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';
const noDB = process.env.NODB;

if (noDB) {
  https
    .createServer({key: selfSignedCert.key, cert: selfSignedCert.cert}, app)
    .listen(443, 'localhost.ya-praktikum.tech',  () => {
      console.log('SSR HTTPS Application is started on localhost:', port);
    });
  /*app.listen(devOptions,  () => {
    console.log('Application is started on localhost:', port);
  });*/
  return;
} else {
  dbConnect().finally(() => {
    app.listen(port, () => {
      console.log('Application is started on localhost:', port);
    });
  })
};
