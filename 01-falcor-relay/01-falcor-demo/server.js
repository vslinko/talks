const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const falcorMiddleware = require('falcor-express');
const bodyParserMiddleware = require('body-parser');

const webpackConfig = require('./webpack.config');

const app = express();
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/model.json', bodyParserMiddleware.urlencoded({extended: false}));
app.use('/model.json', bodyParserMiddleware.json());
app.use('/model.json', falcorMiddleware.dataSourceRoute(require('./dataSource')));

app.listen(3000);
