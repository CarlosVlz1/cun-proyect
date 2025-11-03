/* eslint-disable @typescript-eslint/no-var-requires */
// webpack.config.js debe usar CommonJS por compatibilidad con webpack
module.exports = function (options, webpack) {
  return {
    ...options,
    externals: [
      ...(options.externals || []),
      {
        'mock-aws-s3': 'commonjs mock-aws-s3',
        'aws-sdk': 'commonjs aws-sdk',
        'nock': 'commonjs nock',
      },
    ],
    module: {
      ...options.module,
      rules: [
        ...(options.module?.rules || []),
        {
          test: /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html$/,
          type: 'asset/source',
        },
      ],
    },
    ignoreWarnings: [
      /Failed to parse source map/,
      /Can't resolve/,
      {
        module: /node_modules\/@mapbox\/node-pre-gyp/,
      },
    ],
  };
};
