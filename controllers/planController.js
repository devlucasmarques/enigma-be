const mongoose = require('mongoose');
const PlanModel = require('../models/planModel');
const UserModel = require('../models/userModel');

const getPlan = async (req, res) => {
  const { email, confirm: hash } = req.query;
  if (email && hash) {
    try {
      const user = await UserModel.findOne({ email, hash });
      if (!user) {
        return res.status(404).json({ error: true });
      }
    } catch (err) {
      res.status(598).json({ error: true });
    }
  }
  try {
    const Plans = await PlanModel.find({});
    res.status(200).json(Plans);
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const savePlan = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body } = req;

    const doc = new PlanModel(body);
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).json({});
  } catch (e) {
    res.status(599).json({ error: true });
  }
};

const editPlan = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { body } = req;

    const _id = '6750cc2869af3a2902611b74'; // Existe apenas um registro
    const changed = await PlanModel.updateOne({ _id }, body);
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

module.exports = { getPlan, savePlan, editPlan };
