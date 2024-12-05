const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const paymentOtherSchema = new Schema({
  id: SchemaTypes.ObjectId,
  // Type of payment (e.g., credit card, PayPal, etc.)
  paymentType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  //Assinatura de 12 meses, 6 meses, etc
  product: {
    type: String,
    required: true
  },
  //cupom
  coupon: {
    type: String,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  //espera mascara do cartao, numero boleto, qq info importante
  info: {
    type: String,
    required: true
  },
  coupon: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  }
});

const PaymentOther = mongoose.model(
  '_enigma_payment_other',
  paymentOtherSchema
);

module.exports = PaymentOther;
