import path from 'path';
import express, {RequestHandler} from 'express';
import serverRenderMiddleware from './server.middleware.render';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import clientConfig from '@webpack/client.config';
import dbConnect from '../../postgres';
import topicRouter from './server.topic.endpoints';
import userRouter from './server.user.endpoint';

function getWebpackMiddlewares(config: webpack.Configuration): RequestHandler[] {
  const compiler = webpack({...config, mode: 'development'});

  return [
    devMiddleware(compiler, {
      publicPath: config.output!.publicPath!,
    }),
  ];
}

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('/*', [...getWebpackMiddlewares(clientConfig)], serverRenderMiddleware);

app.use(topicRouter);
app.use(userRouter);

export {app, dbConnect};
