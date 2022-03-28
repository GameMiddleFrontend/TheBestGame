const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  context: __dirname,
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map': 'source-map',
  devServer: {
    hot: true,
    port: 8080,
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    historyApiFallback: true,
  },

  entry: path.join(SRC_DIR, 'index.tsx'),
  output: {
    filename: '[name].js',
    path: OUTPUT_DIR,
    clean: true,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '...'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          "style-loader",
          {
            loader: 'css-loader',
            options: {
              url: true,
            },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'static/index.html',
    }),
  ]
};
