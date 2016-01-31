const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
  entry: './src',

  output: {
    path: `${__dirname}/dist`,
    filename: 'app.js',
  },

  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/,
        loader: `babel-loader?presets[]=es2015,
                presets[]=react,presets[]=stage-0,
                plugins[]=transform-runtime` },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader',
                `css-loader?modules&importLoaders=1
                &localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader`
              ) },
    ],
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
  },

  postcss: [
    require('autoprefixer'),
    require('postcss-nested'),
  ],
};
