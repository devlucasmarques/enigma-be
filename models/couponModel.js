const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaCoupon = new Schema({
  id: SchemaTypes.ObjectId,
  createAt: Date,
  code: String,
  validity: String,
  quantity: String,
  discount: String,
  percOff: String,
  erased: Boolean
});

const CouponModel = mongoose.model('_enigma_coupon', SchemaCoupon);

module.exports = CouponModel;
