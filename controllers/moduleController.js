const mongoose = require('mongoose');
const ModuleModel = require('../models/moduleModel');

const getModules = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const Modules = await ModuleModel.find({});
    res.status(200).json(Modules);
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const getModulesDTO = async (req, res) => {
  if (req.level > 10)
    return res
      .status(403)
      .json({ factories: [], models: [], modules: [], error: true });

  try {
    const Modules = await ModuleModel.find({}, { _id: 1, idModel: 1, name: 1 });
    res.status(200).json(Modules);
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const getModuleDTO_image = async (req, res) => {
  if (req.level > 10)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const module = await ModuleModel.findOne(
      { _id },
      {
        _id: 1,
        idModel: 1,
        name: 1,
        images: 1,
        size: 1,
        component: 1,
        credit: 1
      }
    );

    if (!module) res.status(404).json({ error: true });

    res.status(200).json(module);
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const findModule = async (req, res) => {
  if (req.level > 10)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const found = await ModuleModel.findOne({ _id });

    found ? res.status(200).json(found) : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const findModulesModel = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: idModel } = params;

    if (!mongoose.isValidObjectId(idModel)) {
      res.status(400).json({ error: true });
      return;
    }

    const modules = await ModuleModel.find(
      { idModel },
      { _id: 1, name: 1, idCopyModule: 1, size: 1, component: 1, credit: 1 }
    );
    modules
      ? res.status(200).json(modules)
      : res.status(404).json({ error: true });
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const saveModule = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const dateCreate = new Date().toISOString();
  const idUser = req.userId;

  try {
    const { body } = req;
    const {
      idModel,
      idServiceType,
      name,
      size,
      component,
      credit = '1',
      images = [],
      fileBase,
      donateFilename
    } = body;
    if (!idServiceType) {
      res.status(400).json({ error: true });
      return;
    }

    const doc = new ModuleModel({
      idModel,
      idServiceType,
      name,
      size,
      component,
      credit,
      images,
      dateCreate,
      idUser,
      fileBase,
      donateFilename,
      hasImageCopy: images.length > 0
    });
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).json({});
  } catch (e) {
    console.error(e);
    res.status(599).json({ error: true });
  }
};

const saveModulePaste = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const dateCreate = new Date().toISOString();
  const idUser = req.userId;

  try {
    const { body } = req;
    const { idModel, name, idCopyModule, component, credit, size } = body;

    const doc = new ModuleModel({
      idModel,
      name,
      dateCreate,
      idUser,
      idCopyModule,
      component,
      credit,
      size
    });
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).json({});
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const editModule = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body, params } = req;
    const {
      name,
      size,
      component,
      credit,
      images = [],
      fileBase,
      donateFilename
    } = body;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }
    const dateUpdate = new Date().toISOString();
    const idUser = req.userId;

    const changed = name
      ? await ModuleModel.updateOne(
          { _id },
          {
            name,
            size,
            component,
            credit,
            images,
            dateUpdate,
            idUser,
            fileBase,
            donateFilename,
            hasImageCopy: images.length > 0
          }
        )
      : await ModuleModel.updateOne({ _id }, { images });

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

const deleteModule = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { params } = req;
    const { id: _id } = params;

    if (!mongoose.isValidObjectId(_id)) {
      res.status(400).json({ error: true });
      return;
    }

    const deleted = await ModuleModel.deleteOne({ _id });
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

const uploadS3 = (req, res) => {
  return res.status(202).json({ message: 'success' });
};

module.exports = {
  getModules,
  findModule,
  findModulesModel,
  saveModule,
  saveModulePaste,
  editModule,
  deleteModule,
  getModulesDTO,
  getModuleDTO_image,
  uploadS3
};
