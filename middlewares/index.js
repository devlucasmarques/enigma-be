const express = require('express');
const { urlencoded } = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const getMiddlewares = (app) => {
  app.use(cors());
  app.use(urlencoded({ extended: false }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
  );
};

module.exports = { getMiddlewares };
