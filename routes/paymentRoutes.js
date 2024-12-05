const { Router } = require('express');
const {
  getPayments,
  getPaymentOne
} = require('../controllers/paymentController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/payments', verifyJWT, getPayments);
router.get('/paymentOne/:id', verifyJWT, getPaymentOne);
module.exports = router;
