const mongoose = require('mongoose');
const ServiceTypeModel = require('../models/serviceTypeModel');

const saveServiceType = async (req, res) => {
  try {
    if (req.level > 5) {
      res.status(403).end();
      return;
    }

    const {
      body: { name }
    } = req;

    const doc = new ServiceTypeModel({ name });
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).end();

    // cheat para apagar enquanto nao tem rota
    // const deleted = await ServiceTypeModel.deleteOne({
    //   _id: '67a1605f3a3d3ea78da1464d'
    // });

    res.status(201).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

const listServiceType = async (req, res) => {
  try {
    if (req.level > 5) {
      res.status(403).end();
      return;
    }

    const serviceType = await ServiceTypeModel.find();

    res.status(200).json(serviceType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

module.exports = { saveServiceType, listServiceType };
