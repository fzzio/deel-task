const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')
const balancesController = require('../controllers/balances.controller');

router.post('/deposit/:userId', getProfile, balancesController.depositsMoney);

module.exports = router;