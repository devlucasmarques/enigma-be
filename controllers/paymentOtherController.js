const CouponModel = require('../models/couponModel');
const PaymentOther = require('../models/paymentOtherModel');

async function savePayment(req, res) {
  //checar hash e email para fazer um bypass

  return res.status(555).json({ hash: req.body.hash, email: req.body.email });
  if (req.level > 10)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { amount, product, coupon, info } = req.body;

  const email = req.email;

  const paymentType = 'CREDIT_CARD';
  // buscar o desconto atraves do cupom e testar se está expirado e tudo mais

  try {
    const couponFound = await CouponModel.findOne(
      { code: coupon },
      { percOff: 1 }
    );

    const discount = couponFound ? couponFound.percOff : '0.00%';

    const newPayment = new PaymentOther({
      paymentType,
      amount,
      email,
      product,
      coupon,
      discount,
      info,
      status: 'Pendente'
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function listPayments(req, res) {
  if (req.level > 10)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const payments = await PaymentOther.find({
      status: { $exists: true, $ne: null }
    }).sort({ creationDate: -1 });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  savePayment,
  listPayments
};
