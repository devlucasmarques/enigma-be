const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaUser = new Schema({
  id: SchemaTypes.ObjectId,
  planMonthNumber: Number,
  lastPaymentDate: Date,
  name: String,
  fone: String,
  cpf: String,
  password: String,
  changePassword: String,
  hash: String,
  email: String,
  credits: Number,
  level: Number,
  deactive: Boolean
});

const UserModel = mongoose.model('_enigma_user', SchemaUser);

module.exports = UserModel;
