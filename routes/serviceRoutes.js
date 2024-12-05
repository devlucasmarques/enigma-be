const { Router } = require('express');
const {
  saveService,
  getAllService,
  getService,
  getAllServiceCount
} = require('../controllers/serviceController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.post('/service/:idModule', verifyJWT, saveService);
router.get('/services', verifyJWT, getAllService);
router.get('/services-count', verifyJWT, getAllServiceCount);
router.get('/service', verifyJWT, getService);

module.exports = router;
