const videoRegex = /\.mp4$/;

export default {
  client: {
    test: videoRegex,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'video/[name].[ext]',
        },
      },
    ],
  },
  server: {
    test: videoRegex,
    loader: 'null-loader',
  },
};
