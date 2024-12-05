const mongoose = require('mongoose');
const FactoryModel = require('../models/factoryModel');
const ModelModel = require('../models/modelModel');
const ModuleModel = require('../models/moduleModel');

const getCalc = async (req, res) => {
  if (req.level > 10)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const factories = await FactoryModel.find({});
    const models = await ModelModel.find({});
    const modules = await ModuleModel.find(
      {},
      {
        _id: 1,
        idCopyModule: 1,
        idModel: 1,
        name: 1,
        size: 1,
        component: 1,
        hasImageCopy: 1
      }
    );
    res.status(200).json({ factories, models, modules });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

module.exports = { getCalc };
