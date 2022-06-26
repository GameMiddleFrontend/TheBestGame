import path from 'path';
import express from 'express';
import serverRenderMiddleware from './middleware/server.middleware.render';
import clientConfig from '@webpack/client.config';
import dbConnect from '../../postgres';
import topicRouter from './endpoint/server.topic.endpoints';
import userRouter from './endpoint/server.user.endpoint';
import CSPRouter from './middleware/server.middleware.CSP';
import getWebpackMiddlewares from './middleware/server.middleware.webpack';

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.use(CSPRouter);
app.get('/*', [...getWebpackMiddlewares(clientConfig)], serverRenderMiddleware);

app.use(topicRouter);
app.use(userRouter);

export {app, dbConnect};
