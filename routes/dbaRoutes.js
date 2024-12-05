const { Router } = require('express');

const { verifyJWT } = require('../helpers/jwt');
const {
  cloneFactories,
  cloneModules,
  cloneModels
} = require('../controllers/dbaController');

const router = Router();

router.post('/dba/clone/factories', verifyJWT, cloneFactories);
router.post('/dba/clone/modules', verifyJWT, cloneModules);
router.post('/dba/clone/models', verifyJWT, cloneModels);

module.exports = router;
