const audioRegex = /\.mp3$/;

export default {
  client: {
    test: audioRegex,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: 'audio/[name].[ext]',
        },
      },
    ],
  },
  server: {
    test: audioRegex,
    loader: 'null-loader',
  },
};
