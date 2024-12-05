const { Router } = require('express');

const { verifyJWT } = require('../helpers/jwt');
const { CREDIT_CARD } = require('./constants');
const {
  list,
  save,
  erase,
  selected,
  payment
} = require('../controllers/creditCardController');

const router = Router();

router.get(CREDIT_CARD.SINGLE, verifyJWT, list);
router.post(CREDIT_CARD.SINGLE, verifyJWT, save);
router.post(CREDIT_CARD.PAYMENT, payment);
router.delete(CREDIT_CARD.WITH_CARD_ID, verifyJWT, erase);
router.put(CREDIT_CARD.WITH_CARD_ID, verifyJWT, selected);

module.exports = router;
