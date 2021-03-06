import {Configuration as WebpackConfig, Entry} from 'webpack';
import path from 'path';
import {DIST_DIR, SRC_DIR} from './env';

import fileLoader from './loaders/file';
import stylesLoader from './loaders/styles';
import jsLoader from './loaders/ts';
import videoLoader from './loaders/video';
import audioLoader from './loaders/audio';

import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const clientConfig: WebpackConfig = {
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
  context: __dirname,
  target: 'web',
  entry: [path.join(SRC_DIR, 'index.client')].filter(Boolean) as unknown as Entry,
  module: {
    rules: [videoLoader.client, audioLoader.client, fileLoader.client, stylesLoader.client, jsLoader.client],
  },
  output: {
    filename: '[name].js',
    path: DIST_DIR,
    publicPath: '/',
  },
  resolve: {
    modules: ['../src', '../node_modules'],
    extensions: ['.ts', '.tsx', '...'],
    plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(SRC_DIR, 'sw.js'),
          to: 'sw.js',
        },
        {from: path.resolve(SRC_DIR, 'styles/images'), to: 'images'},
      ],
    }),
  ],
};

export default clientConfig;
