const mongoose = require('mongoose');
const CouponModel = require('../models/couponModel');
const { formatDatesFE } = require('../helpers/date');
const { startOfDay, endOfDay } = require('date-fns');

const saveCoupon = async (req, res) => {
  try {
    if (req.level > 5)
      return res.status(403).json({ factories: [], models: [], modules: [] });
    const { body } = req;
    const {
      code,
      validity = '',
      quantity = '',
      discount = '',
      percOff = ''
    } = body;

    if (!code) {
      res.status(400).end();
      return;
    }

    const createAt = new Date().toISOString();
    const erased = false;
    const doc = new CouponModel({
      code,
      validity,
      quantity,
      discount,
      percOff,
      createAt,
      erased
    });
    const saved = await doc.save();
    saved ? res.status(201).json(saved._id) : res.status(500).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

const listCoupon = async (req, res) => {
  try {
    if (req.level > 5)
      return res.status(403).json({ factories: [], models: [], modules: [] });

    const {
      code,
      initialDate,
      finalDate,
      email,
      avaiable = true,
      unavaiable,
      page
    } = req.query;

    const defaultDate = new Date();
    const [formmatedInitialDate, formmatedFinalDate] = initialDate
      ? formatDatesFE(initialDate, finalDate)
      : [startOfDay(defaultDate), endOfDay(defaultDate)];

    const validity = {
      $gte: formmatedInitialDate,
      $lte: formmatedFinalDate
    };

    const codeRegex = new RegExp(code, 'i');

    const find = { validity, code: codeRegex };

    let couponsAvaiable;
    const filterPage = page ? page : 1;
    const LIMIT_PER_PAGE = 20;
    const SKIP_PER_PAGE = (filterPage - 1) * LIMIT_PER_PAGE;
    if (avaiable) {
      // couponsAvaiable = await CouponModel.find(
      //   find,
      //   {},
      //   { skip: SKIP_PER_PAGE, limit: LIMIT_PER_PAGE }
      // );
      couponsAvaiable = await CouponModel.find(
        {},
        {},
        { skip: SKIP_PER_PAGE, limit: LIMIT_PER_PAGE }
      );
    }
    res.status(200).json({ couponsAvaiable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

const valueCoupon = async (req, res) => {
  try {
    if (req.level > 10)
      return res.status(403).json({ factories: [], models: [], modules: [] });

    const { params } = req;

    const coupon = await CouponModel.findOne(
      { code: params.code },
      { percOff: 1 }
    );
    const percOff = coupon ? coupon.percOff : '0.00';

    res.status(200).json({ percOff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'General Error' });
  }
};

module.exports = { saveCoupon, listCoupon, valueCoupon };
