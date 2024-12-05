const { Router } = require('express');
const {
  getUsers,
  getUser,
  saveUser,
  editNewUser,
  editUser,
  deleteUser,
  login,
  logged,
  deactiveUser,
  changePassword,
  payment
} = require('../controllers/userController');
const { verifyJWT } = require('../helpers/jwt');

const router = Router();

router.get('/users', verifyJWT, getUsers);
router.get('/user/:id', verifyJWT, getUser);
router.post('/user', verifyJWT, saveUser);
router.put('/user/:id', verifyJWT, editUser);
router.put('/user-out/:id', editNewUser);
router.delete('/user/:id', verifyJWT, deleteUser);
router.get('/user/deactive/:id', verifyJWT, deactiveUser);
router.post('/login', login);
router.get('/logged', verifyJWT, logged);
router.post('/user/changePassword', changePassword);
router.get('/payment/:id', verifyJWT, payment);
module.exports = router;
