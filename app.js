import express from 'express';
import bodyParser from 'body-parser';

const app = express();

/*
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 */

// Set up JSON parsers
app.use(bodyParser.urlencoded({
  extended: false,
}));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({
  type: 'application/vnd.api+json',
}));


// Serve application file depending on environment
app.get('/app.js', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(`${__dirname}/build/app.js`);
  } else {
    res.redirect('//localhost:9090/build/app.js');
  }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(`${__dirname}/build/style.css`);
  } else {
    res.redirect('//localhost:9090/build/style.css');
  }
});

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/build/index.html`);
});

// Test data for graphing
app.get('/api/test', (req, res) => {
  res.send();
});

// Interact with ebay API
app.post('/api', (req, res) => {
  res.send();
});

/*
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 */

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack.local.config');
  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true,
  }).listen(9090, 'localhost', (err) => {
    if (err) {
      console.log(err);
    }
  });
}
/*
 *
 * Express server
 *
 */

let port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  const host = server.address().address;
  port = server.address().port;

  console.log('Essential React listening at http://%s:%s', host, port);
});
