const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaPlan = new Schema({
  id: SchemaTypes.ObjectId,
  valueMonth1: Number,
  valueMonth2: Number,
  valueMonth3: Number,
  valueMonth4: Number,
  valueMonth5: Number,
  valueMonth6: Number,
  valueMonth7: Number,
  valueMonth8: Number,
  valueMonth9: Number,
  valueMonth10: Number,
  valueMonth11: Number,
  valueMonth12: Number
});

const PlanModel = mongoose.model('_enigma_plan', SchemaPlan);

module.exports = PlanModel;
