const mongoose = require('mongoose');
const FactoryModel = require('../models/factoryModel');

const getFactories = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  if (!req.query || !req.query.serviceType) {
    res.status(400).json({ error: true });
    return;
  }

  try {
    const find =
      req.query.serviceType !== '67a161f97f64e0a93b665804' //codigo do tipo airbag
        ? { idServiceType: req.query.serviceType }
        : {
            $or: [{ idServiceType: { $exists: false } }]
          };
    const Factories = await FactoryModel.find(find);
    res.status(200).json(Factories);
  } catch (e) {
    res.status(599).json({ error: true });
    console.error(e);
  }
};

const saveFactory = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body } = req;
    const { factory, localImage, models, idServiceType } = body;
    const doc = new FactoryModel({
      factory,
      localImage,
      models,
      idServiceType
    });
    console.log('idServiceType', idServiceType);

    if (!idServiceType) {
      res.status(400).json({ error: true });
      return;
    }

    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).json({});
    res.status(201).end();
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const editFactory = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body, params } = req;
    const { factory, localImage, models } = body;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const changed = await FactoryModel.updateOne(
      { _id },
      { factory, localImage, models }
    );
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

const deleteFactory = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const factory = await FactoryModel.findOne({ _id });
    if (factory) {
      const { models } = factory;
      if (models.length > 0) {
        res.status(501).json({ error: true });
        return;
      }
    }

    const deleted = await FactoryModel.deleteOne({ _id });
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

module.exports = { getFactories, saveFactory, editFactory, deleteFactory };
