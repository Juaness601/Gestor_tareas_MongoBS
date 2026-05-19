const express = require('express');
const router = express.Router();
const { registro, login, perfil } = require('../controllers/auth.controller');
const { autenticar } = require('../middlewares/auth.middleware');

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', autenticar, perfil);

module.exports = router;
