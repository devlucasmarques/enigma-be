const mongoose = require('mongoose');

const mongo = {
  host: 'mongodb.pira-app.com.br',
  user: 'pira-app01',
  password: 'thorMyDog',
  db: 'pira-app01'
};

const { host, user, password, db } = mongo;

mongoose.connect(
  `mongodb://${user}:${password}@${host}:27017/${db}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log('Erro ao connectar Mongo', err);
    else console.log('Mongo connectado');
  }
);

module.exports = mongoose;
