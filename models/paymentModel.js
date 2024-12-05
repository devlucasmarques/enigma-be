const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaPayment = new Schema({
  id: SchemaTypes.ObjectId,
  paymentDate: Date,
  dueDate: Date,
  cost: Number,
  userName: String,
  idUser: SchemaTypes.ObjectId,
  adminName: String
});

const PaymentModel = mongoose.model('_enigma_payment', SchemaPayment);

module.exports = PaymentModel;
