const mongoose = require('mongoose');

const creditCardSchema = new mongoose.Schema({
  maskedCardNumber: {
    type: String,
    required: true
  },
  cardholderName: {
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  paymentProcessorToken: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userCreditCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: '_enigma_user',
    required: true
  },
  creditCard: creditCardSchema
});

const UserCreditCard = mongoose.model(
  '_enigma_user_credit_card',
  userCreditCardSchema
);

module.exports = UserCreditCard;
