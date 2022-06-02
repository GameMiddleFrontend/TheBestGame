import path from 'path';
import express, {RequestHandler} from 'express';
import serverRenderMiddleware from './server.middleware.render';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import clientConfig from '@webpack/client.config';
import dbConnect from '../../postgres';

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

export {app, dbConnect};
