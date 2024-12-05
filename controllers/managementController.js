const { endOfDay, startOfDay, format } = require('date-fns');
const mongoose = require('mongoose');
const { formatDatesFE } = require('../helpers/date');
const FactoryModel = require('../models/factoryModel');
const ModelModel = require('../models/modelModel');
const ModuleModel = require('../models/moduleModel');
const ServiceModel = require('../models/serviceModel');
const UserModel = require('../models/userModel');

require('dotenv-safe').config();

const getInfo = async (req, res) => {
  if (!req.level || req.level > 5)
    return res.status(403).json({ message: 'Não autorizado!' });

  let countUsers;
  let countFactories;
  let countModels;
  let countModules;
  let countServices;
  try {
    countUsers = await UserModel.count({
      level: { $gte: 5 }
    });
  } catch (err) {}

  try {
    countFactories = await FactoryModel.count({});
  } catch (err) {}

  try {
    countModels = await ModelModel.count({});
  } catch (err) {}

  try {
    countModules = await ModuleModel.count({});
  } catch (err) {}

  try {
    countServices = await ServiceModel.count({});
  } catch (err) {}

  res.status(200).json({
    countUsers,
    countFactories,
    countModels,
    countModules,
    countServices
  });
};

const getServices = async (servicesBrute, email) => {
  return await Promise.all(
    servicesBrute.map(async (service) => {
      const registerDate = format(service.registerDate, 'dd/MM/yyyy');
      const userEmail = email
        ? email
        : (await UserModel.findOne({ _id: service.idUser }, { email: 1 }))
            .email;

      const module = await ModuleModel.findOne(
        { _id: service.idModule },
        { name: 1 }
      );

      const moduleName = module
        ? `Limpar crash ${module.name}`
        : `Modulo desativado`;
      return { registerDate, userEmail, moduleName };
    })
  );
};

const getServiceByFilter = async (req, res) => {
  if (!req.level || req.level > 5)
    return res.status(403).json({ message: 'Não autorizado!' });

  try {
    const { initialDate, finalDate, page, email, service } = req.query;
    const defaultDate = new Date();
    const [formmatedInitialDate, formmatedFinalDate] = initialDate
      ? formatDatesFE(initialDate, finalDate)
      : [startOfDay(defaultDate), endOfDay(defaultDate)];

    const registerDate = {
      $gte: formmatedInitialDate,
      $lte: formmatedFinalDate
    };

    const moduleName = new RegExp(service, 'i');

    const find = { registerDate, moduleName };

    if (email) {
      const idUser = (await UserModel.findOne({ email }, { id: 1 }))._id;
      find.idUser = idUser;
    }

    const filterPage = page ? page : 1;
    const LIMIT_PER_PAGE = 10;
    const SKIP_PER_PAGE = (filterPage - 1) * LIMIT_PER_PAGE;

    const servicesBrute = await ServiceModel.find(
      find,
      {},
      { skip: SKIP_PER_PAGE, limit: LIMIT_PER_PAGE }
    );

    const services = await getServices(servicesBrute, email);

    const serviceCountFull = await ServiceModel.count(find);
    const serviceCountAdmin = await ServiceModel.count({
      ...find,
      $or: [
        { idUser: mongoose.Types.ObjectId('61eab472f816ea69cee8dcf2') }, //chico
        { idUser: mongoose.Types.ObjectId('61eb0b60f816ea69cee8dd14') } //mario
      ]
    });
    const serviceCountClient = serviceCountFull - serviceCountAdmin;

    res.status(200).json({
      serviceCountFull,
      serviceCountAdmin,
      serviceCountClient,
      services
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

module.exports = {
  getInfo,
  getServiceByFilter
};
