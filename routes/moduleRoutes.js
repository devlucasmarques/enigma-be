const { Router } = require('express');
const {
  getModules,
  findModule,
  findModulesModel,
  saveModule,
  saveModulePaste,
  editModule,
  deleteModule,
  getModulesDTO,
  getModuleDTO_image,
  uploadS3
} = require('../controllers/moduleController');
const { verifyJWT } = require('../helpers/jwt');
const multer = require('multer');
const multerConfig = require('../config/multer');

const router = Router();

router.get('/modules', verifyJWT, getModules);
router.get('/modulesDTO', verifyJWT, getModulesDTO);
router.get('/modulesDTO_image/:id', verifyJWT, getModuleDTO_image);
router.get('/module/:id', verifyJWT, findModule);
router.get('/modulesModel/:id', verifyJWT, findModulesModel);
router.post('/module', verifyJWT, saveModule);
router.post('/module-paste', verifyJWT, saveModulePaste);
router.put('/module/:id', verifyJWT, editModule);
router.delete('/module/:id', verifyJWT, deleteModule);
router.post(
  '/module/uploadImage',
  [verifyJWT, multer(multerConfig).single('file')],
  uploadS3
);
router.post(
  '/module/uploadFile',
  [verifyJWT, multer(multerConfig).single('file')],
  uploadS3
);
module.exports = router;
