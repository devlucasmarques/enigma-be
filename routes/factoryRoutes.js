const { Router } = require('express');
const {
  getFactories,
  saveFactory,
  editFactory,
  deleteFactory
} = require('../controllers/factoryController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/factories', verifyJWT, getFactories);
router.post('/factory', verifyJWT, saveFactory);
router.put('/factory/:id', verifyJWT, editFactory);
router.delete('/factory/:id', verifyJWT, deleteFactory);

module.exports = router;
