const { format } = require('date-fns');
const mongoose = require('mongoose');
const PaymentModel = require('../models/paymentModel');

const getPayments = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });
  try {
    const payments = await PaymentModel.find();

    res.status(200).json(payments);
  } catch (err) {
    res.status(400).end();
  }
};

const getPaymentOne = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  try {
    const { id: idUser } = req.params;

    const payments = await PaymentModel.find(
      { idUser },
      {
        paymentDate: 1,
        dueDate: 1,
        adminName: 1,
        paymentType: 1,
        cost: 1,
        status: 1
      }
    );

    const paymentFormatted = payments.map((payment) => ({
      paymentDate: format(payment.paymentDate, 'dd/MM/yyyy') || '',
      dueDate: format(payment.dueDate, 'dd/MM/yyyy') || '',
      adminName: payment.adminName || '',
      paymentType: payment.paymentType || 'Manual',
      cost: payment.cost || '0',
      status: payment.status || 'Aprovado'
    }));

    res.status(200).json(paymentFormatted);
  } catch (err) {
    res.status(400).end();
  }
};

module.exports = { getPayments, getPaymentOne };
