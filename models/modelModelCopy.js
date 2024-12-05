const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaModel = new Schema({
  dateCreate: Date,
  dateUpdate: Date,
  id: SchemaTypes.ObjectId,
  idFactory: SchemaTypes.ObjectId,
  idUser: SchemaTypes.ObjectId,
  name: String,
  modules: [SchemaTypes.ObjectId]
});

const ModelModel = mongoose.model('_cm_model', SchemaModel);

module.exports = ModelModel;
