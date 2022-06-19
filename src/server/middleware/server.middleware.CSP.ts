import express from 'express';

const CSPRouter = express.Router();

CSPRouter.use((request, response, next) => {
  console.log("cookie:" + JSON.stringify(request.cookies));
  response.header(
    'Content-Security-Policy',
    "default-src 'self' https://ya-praktikum.tech; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; ",
  );
  next();
});

export default CSPRouter;
