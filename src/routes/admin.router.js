const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')
const adminController = require('../controllers/admin.controller');

router.get('/best-profession', getProfile, adminController.bestProfession);
router.get('/best-clients', getProfile, adminController.bestClients);

module.exports = router;