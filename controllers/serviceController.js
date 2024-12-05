const mongoose = require('mongoose');
const ModuleModel = require('../models/moduleModel');
const ServiceModel = require('../models/serviceModel');
const UserModel = require('../models/userModel');
const { previousSunday } = require('date-fns');

const getInfoCredit = (idUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await UserModel.findOne({ _id: idUser }, { credits: 1 });
      if (!user) reject({ isBlocked: true });

      const dateSearch = previousSunday(new Date());
      const { credits = 0 } = user;
      const servicesUser = await ServiceModel.find({
        idUser,
        registerDate: { $gt: dateSearch }
      });
      if (!servicesUser) reject({ isBlocked: true });

      const usedCredits = servicesUser.length;
      const weekCredits = credits;
      const isBlocked = weekCredits <= usedCredits;

      resolve({
        weekCredits,
        usedCredits,
        isBlocked
      });
    } catch (err) {
      reject({ isBlocked: true, err });
    }
  });
};

const saveService = async (req, res) => {
  if (req.level > 10)
    return res
      .status(403)
      .json({ factories: [], models: [], modules: [], error: 403 });

  try {
    const { idModule } = req.params;
    const idUser = req.userId;
    const registerDate = new Date().toISOString();

    if (!mongoose.isValidObjectId(idModule)) {
      res.status(400).json({ error: 400, message: 'Cliente não encontrado!' });
      return;
    }
    const infoCredits = await getInfoCredit(idUser);

    if (infoCredits.isBlocked) {
      res
        .status(400)
        .json({ error: 400, message: 'Seu limite semanal foi atingido!' });
      return;
    }

    const user = await UserModel.findOne({ _id: idUser }, { email: 1 });
    const module = await ModuleModel.findOne({ _id: idModule }, { name: 1 });

    const docService = {
      idUser,
      idModule,
      registerDate,
      userEmail: user.email,
      moduleName: module.name
    };
    const doc = new ServiceModel(docService);
    const saved = await doc.save();

    saved
      ? res.status(201).json({ ...saved, ...infoCredits })
      : res.status(500).json({ error: 500 });
  } catch (err) {
    res.status(599).json({ error: 599 });
  }
};

const getService = async (req, res) => {
  if (req.level > 10) {
    return res.status(403).json({ error: true });
  }
  const idUser = req.userId;
  const infoCredits = await getInfoCredit(idUser);
  const status = infoCredits.isBlocked ? 500 : 200;

  res.status(status).json(infoCredits);
};

const getAllService = async (req, res) => {
  if (req.level > 5) {
    return res.status(403).json({ error: true });
  }
  try {
    const services = await ServiceModel.find({});

    res.status(200).json(services);
  } catch (err) {
    res.status(599).json({ error: 599 });
  }
};

const getAllServiceCount = async (req, res) => {
  if (req.level > 5) {
    return res.status(403).json({ error: true });
  }
  try {
    const services = await ServiceModel.aggregate()
      .match({ moduleName: { $ne: null } })
      .project({ _id: 0, moduleName: 1 })
      .group({ _id: '$moduleName', count: { $sum: 1 } })
      .sort({ count: -1 });

    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(599).json({ error: 599 });
  }
};

module.exports = { saveService, getAllService, getService, getAllServiceCount };
