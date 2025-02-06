const { Router } = require('express');

const { verifyJWT } = require('../helpers/jwt');
const { SERVICE_TYPE } = require('./constants');
const {
  listServiceType,
  saveServiceType
} = require('../controllers/serviceTypeController');

const router = Router();

router.get(SERVICE_TYPE.SINGLE, listServiceType);
router.post(SERVICE_TYPE.SINGLE, saveServiceType);

module.exports = router;
