const mongoose = require('mongoose');
const ModelModel = require('../models/modelModel');

const getModels = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const Models = await ModelModel.find({});
    res.status(200).json(Models);
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const findModel = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const found = await ModelModel.findOne({ _id });

    found ? res.status(200).json(found) : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const findModelsFactory = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: idFactory } = params;

    if (!mongoose.isValidObjectId(idFactory)) {
      res.status(400).json({ error: true });
      return;
    }

    const dateChange = new Date().toISOString();
    const models = await ModelModel.find({ idFactory }, { _id: 1, name: 1 });
    models
      ? res.status(200).json(models)
      : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const saveModel = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body } = req;
    const { name, idFactory } = body;

    const doc = new ModelModel({ name, idFactory });
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).json({});
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const editModel = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body, params } = req;
    const { name } = body;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const changed = await ModelModel.updateOne({ _id }, { name });
    if (!changed) {
      res.status(500).json({ error: true });
      return;
    }

    changed
      ? res.status(200).json({ error: false })
      : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const deleteModel = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }
    const model = await ModelModel.findOne({ _id });
    if (model) {
      const { modules } = model;
      if (modules.length > 0) {
        res.status(501).json({ error: true });
        return;
      }
    }

    const deleted = await ModelModel.deleteOne({ _id });
    if (!deleted) {
      res.status(500).json({ error: true });
      return;
    }

    deleted && deleted.deletedCount
      ? res.status(200).json({ error: false })
      : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

module.exports = {
  getModels,
  findModel,
  findModelsFactory,
  saveModel,
  editModel,
  deleteModel
};
