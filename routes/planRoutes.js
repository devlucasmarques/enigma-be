const { Router } = require('express');
const {
  getPlan,
  savePlan,
  editPlan
} = require('../controllers/planController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/plan', getPlan);
router.post('/plan', verifyJWT, savePlan);
router.put('/plan', verifyJWT, editPlan);

module.exports = router;
