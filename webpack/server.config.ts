import {Configuration as WebpackConfig} from 'webpack';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import {DIST_DIR, SRC_DIR} from './env';

import fileLoader from './loaders/file';
import stylesLoader from './loaders/styles';
import jsLoader from './loaders/ts';
import videoLoader from './loaders/video';

import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';

const serverConfig: WebpackConfig = {
  devtool: 'source-map',
  name: 'server',
  target: 'node',
  node: {__dirname: false},
  entry: path.join(SRC_DIR, 'server/server'),
  module: {
    rules: [videoLoader.server, fileLoader.server, stylesLoader.server, jsLoader.server],
  },
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    path: DIST_DIR,
    publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.tsx', '...'],
    plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
  },
  externals: [nodeExternals({allowlist: [/\.(?!(?:tsx?|json)$).{1,5}$/i]})],
  optimization: {nodeEnv: false},
};

export default serverConfig;
