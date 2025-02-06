const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaServiceType = new Schema({
  id: SchemaTypes.ObjectId,
  name: String,
  createAt: {
    type: Date,
    default: Date.now
  }
});

const ServiceTypeModel = mongoose.model(
  '_enigma_service_type',
  SchemaServiceType
);

module.exports = ServiceTypeModel;
