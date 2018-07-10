const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const statuses = require('statuses');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const mongoose = require('./mongoose');

const authentication = require('./authentication');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Set up homepage
app.get('/', function (req, res) {
  if (req.accepts('text/html')) {
    res.render('index', {
      title: 'Extranet API'
    });
  } else {
    res.json('Extranet API');
  }
});

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({
  logger,
  html: (err, req, res) => {
    let dev = app.settings.env === 'development';

    res.render('error', {
      title: statuses[err.code || 500],
      message: err.expose || dev ? err.message : '',
      error: dev ? `${err.stack}\n\n${JSON.stringify(err, null, 4)}` : ''
    });
  }
}));

app.hooks(appHooks);

module.exports = app;
