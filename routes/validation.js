const express = require('express');
const validationController = require('../controllers/validation');

const router = express.Router();

router.post('/validate-rule', validationController.validate)

module.exports = router;