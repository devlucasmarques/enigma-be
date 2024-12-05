const mongoose = require('mongoose');
const FactoryModel = require('../models/factoryModel');
const FactoryModelCopy = require('../models/factoryModelCopy');
const ModuleModel = require('../models/moduleModel');
const ModuleModelCopy = require('../models/moduleModelCopy');
const ModelsModel = require('../models/modelModel');
const ModelsModelCopy = require('../models/modelModelCopy');

const cloneFactories = async (req, res) => {
  if (req.level > 1)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const FactoriesCopy = await FactoryModelCopy.find({}).lean();
    if (FactoriesCopy.length === 0) {
      res
        .status(400)
        .json({ error: 'A collection de origem não tem documentos' });
      return;
    }

    const countFactoryModel = await FactoryModel.countDocuments();
    if (countFactoryModel > 0) {
      res.status(400).json({ error: 'A collection de destino não está limpa' });
      return;
    }

    const result = await FactoryModel.insertMany(FactoriesCopy);

    console.log(`Copiados ${FactoriesCopy.length} documentos`);

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(599).json({ error: true });
  }
};

const cloneModules = async (req, res) => {
  if (req.level > 1)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const documentsCopy = await ModuleModelCopy.find({}).lean();
    if (documentsCopy.length === 0) {
      res
        .status(400)
        .json({ error: 'A collection de origem não tem documentos' });
      return;
    }

    const countFactoryModel = await ModuleModel.countDocuments();
    if (countFactoryModel > 0) {
      res.status(400).json({ error: 'A collection de destino não está limpa' });
      return;
    }

    await ModuleModel.insertMany(documentsCopy);

    console.log(`Copiados ${documentsCopy.length} documentos`);

    res.status(200).json(documentsCopy);
  } catch (e) {
    console.log(e);
    res.status(599).json({ error: true });
  }
};

const cloneModels = async (req, res) => {
  if (req.level > 1)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const documentsCopy = await ModelsModelCopy.find({}).lean();
    if (documentsCopy.length === 0) {
      res
        .status(400)
        .json({ error: 'A collection de origem não tem documentos' });
      return;
    }

    const countFactoryModel = await ModelsModel.countDocuments();
    if (countFactoryModel > 0) {
      res.status(400).json({ error: 'A collection de destino não está limpa' });
      return;
    }

    await ModelsModel.insertMany(documentsCopy);

    console.log(`Copiados ${documentsCopy.length} documentos`);

    res.status(200).json(documentsCopy);
  } catch (e) {
    console.log(e);
    res.status(599).json({ error: true });
  }
};

module.exports = { cloneFactories, cloneModules, cloneModels };
