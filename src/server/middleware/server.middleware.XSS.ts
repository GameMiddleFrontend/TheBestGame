import express from 'express';

const XSSMiddleware = express.Router();

XSSMiddleware.use((request, response, next) => {
  response.header('X-XSS-Protection', '1; mode=block');
  response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.header('X-Content-Type-Options', 'nosniff');
  next();
});

export default XSSMiddleware;
