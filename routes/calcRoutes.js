const { Router } = require('express');
const { getCalc } = require('../controllers/calcController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/calc', verifyJWT, getCalc);

module.exports = router;
