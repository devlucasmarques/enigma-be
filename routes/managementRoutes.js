const { Router } = require('express');
const {
  getInfo,
  getServiceByFilter
} = require('../controllers/managementController');
const {} = require('../controllers/managementController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/management/info', verifyJWT, getInfo);
router.get('/management/service', verifyJWT, getServiceByFilter);

module.exports = router;
