import express from 'express';

const CSPMiddleware = express.Router();

CSPMiddleware.use((request, response, next) => {
  response.header(
    'Content-Security-Policy',
    "default-src 'self' https://ya-praktikum.tech; " +
      "script-src 'self' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; ",
  );
  next();
});

export default CSPMiddleware;
