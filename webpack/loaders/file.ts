const fileRegex = /\.(png|jp(e*)g|svg|gif)$/;

export default {
  client: {
    test: fileRegex,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'images/[hash]-[name].[ext]',
        },
      },
    ],
  },
  server: {
    test: fileRegex,
    loader: 'null-loader',
  },
};
