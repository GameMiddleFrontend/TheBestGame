export default {
  client: {
    test: /\.(css|scss)$/,
    use: [
      'css-hot-loader',
      'style-loader',
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
    ].filter(Boolean),
  },
  server: {
    test: /\.(css|scss)$/,
    loader: 'null-loader',
  },
};
