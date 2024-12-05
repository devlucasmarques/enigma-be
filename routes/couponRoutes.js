const { Router } = require('express');

const { verifyJWT } = require('../helpers/jwt');
const { COUPON } = require('./constants');
const {
  listCoupon,
  saveCoupon,
  valueCoupon
} = require('../controllers/couponController');

const router = Router();

router.get(COUPON.SINGLE, verifyJWT, listCoupon);
router.get(COUPON.VALUE, verifyJWT, valueCoupon);
router.post(COUPON.SINGLE, verifyJWT, saveCoupon);

module.exports = router;
