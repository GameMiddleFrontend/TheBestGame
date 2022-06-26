import path from 'path';
import express from 'express';
import serverRenderMiddleware from './middleware/server.middleware.render';
import clientConfig from '@webpack/client.config';
import dbConnect from '../../postgres';
import topicRouter from './endpoint/server.topic.endpoints';
import userRouter from './endpoint/server.user.endpoint';
import CSPMiddleware from './middleware/server.middleware.CSP';
import getWebpackMiddlewares from './middleware/server.middleware.webpack';
import cookieParser from 'cookie-parser';
import XSSMiddleware from './middleware/server.middleware.XSS';
import helmet from 'helmet';

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.use(cookieParser());

app.use(
  helmet({
    frameguard: {action: 'DENY'},
    hidePoweredBy: true,
  }),
);

app.use(CSPMiddleware);
app.use(XSSMiddleware);

app.get('/*', [...getWebpackMiddlewares(clientConfig)], serverRenderMiddleware);

app.use(topicRouter);
app.use(userRouter);

export {app, dbConnect};
