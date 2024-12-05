const { Router } = require('express');

const { verifyJWT } = require('../helpers/jwt');
const { PAYMENT_OTHER } = require('./constants');
const {
  listPayments,
  savePayment
} = require('../controllers/paymentOtherController');

const router = Router();

router.get(PAYMENT_OTHER.SINGLE, verifyJWT, listPayments);
router.post(PAYMENT_OTHER.SINGLE, verifyJWT, savePayment);

module.exports = router;
