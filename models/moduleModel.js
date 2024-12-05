const mongoose = require('mongoose');
const { Schema, SchemaTypes } = mongoose;

const SchemaSearch = new Schema({
  sequence: String,
  isHexaSequence: Boolean,
  numberOfBefore: Number,
  numberOfAfter: Number,
  fillValue: String,
  isFillSequence: Boolean
});

const SchemaFileBase = new Schema({
  byteId: Number,
  label: String,
  charValidation: Number,
  size: Number,
  type: String,
  offset: [Number],
  required: Boolean,
  search: SchemaSearch
});

const SchemaModule = new Schema({
  dateCreate: Date,
  dateUpdate: Date,
  id: SchemaTypes.ObjectId,
  idCopyModule: SchemaTypes.ObjectId,
  idModel: SchemaTypes.ObjectId,
  idUser: SchemaTypes.ObjectId,
  name: String,
  size: String,
  component: String,
  hasImageCopy: Boolean,
  images: [
    {
      legend: String,
      filename: String
    }
  ],
  donateFilename: String,
  fileBase: [SchemaFileBase]
});

const ModuleModel = mongoose.model('_enigma_module', SchemaModule);

module.exports = ModuleModel;
