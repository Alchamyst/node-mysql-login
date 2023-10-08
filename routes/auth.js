const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/login', authController.login );
router.get('/logout', authController.logout );
router.post('/register', authController.register );

module.exports = router;