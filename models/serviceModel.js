const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaService = new Schema({
  id: SchemaTypes.ObjectId,
  idModule: SchemaTypes.ObjectId,
  idUser: SchemaTypes.ObjectId,
  registerDate: Date,
  moduleName: String,
  userEmail: String
});

const ServiceModel = mongoose.model('_enigma_service', SchemaService);

module.exports = ServiceModel;
