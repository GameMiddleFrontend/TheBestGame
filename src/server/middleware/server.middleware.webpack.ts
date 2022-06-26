import webpack from 'webpack';
import {RequestHandler} from 'express';
import devMiddleware from 'webpack-dev-middleware';

function getWebpackMiddlewares(config: webpack.Configuration): RequestHandler[] {
  const compiler = webpack({...config, mode: 'development'});

  return [
    devMiddleware(compiler, {
      publicPath: config.output!.publicPath!,
    }),
  ];
}

export default getWebpackMiddlewares;
