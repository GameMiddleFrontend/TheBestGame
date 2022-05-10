import webpack, {Configuration as WebpackConfig, Entry} from 'webpack';
import path from 'path';
import {DIST_DIR, IS_DEV, SRC_DIR} from './env';

import fileLoader from './loaders/file';
import stylesLoader from './loaders/styles';
import jsLoader from './loaders/ts';

import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const clientConfig: WebpackConfig = {
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
  target: 'web',
  entry: [
    IS_DEV && 'react-hot-loader/patch',
    IS_DEV && 'webpack-hot-middleware/client',
    IS_DEV && 'css-hot-loader/hotModuleReplacement',
    path.join(SRC_DIR, 'index.tsx'),
  ].filter(Boolean) as unknown as Entry,
  module: {
    rules: [fileLoader.client, stylesLoader.client, jsLoader.client],
  },
  output: {
    filename: '[name].js',
    path: DIST_DIR,
    clean: true,
    publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {'react-dom': '@hot-loader/react-dom'},
    extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin({configFile: './tsconfig.json'})],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'static/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(SRC_DIR, 'sw.js'),
          to: 'sw.js',
        },
      ],
    }),
  ],
};

export default clientConfig;
