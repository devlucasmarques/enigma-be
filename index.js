const express = require('express');
const app = express();

const { getMiddlewares } = require('./middlewares');
const { getRoutes } = require('./routes');
const mongoose = require('./config/mongo');

const PORT = 21006;

getMiddlewares(app);
getRoutes(app);

app.listen(PORT, () => console.log('Airbag online'));
