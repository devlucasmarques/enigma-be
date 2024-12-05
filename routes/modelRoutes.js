const { Router } = require('express');
const {
  getModels,
  findModel,
  findModelsFactory,
  saveModel,
  editModel,
  deleteModel
} = require('../controllers/modelController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/models', verifyJWT, getModels);
router.get('/model/:id', verifyJWT, findModel);
router.get('/modelsFactory/:id', verifyJWT, findModelsFactory);
router.post('/model', verifyJWT, saveModel);
router.put('/model/:id', verifyJWT, editModel);
router.delete('/model/:id', verifyJWT, deleteModel);

module.exports = router;
