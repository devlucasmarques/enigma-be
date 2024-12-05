const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaFactory = new Schema({
  dateCreate: Date,
  dateUpdate: Date,
  id: SchemaTypes.ObjectId,
  idUser: SchemaTypes.ObjectId,
  factory: String,
  localImage: String,
  models: [SchemaTypes.ObjectId]
});

const FactoryModel = mongoose.model('_enigma_Factory', SchemaFactory);

module.exports = FactoryModel;
