const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')
const jobsController = require('../controllers/jobs.controller');


router.get('/unpaid', getProfile, jobsController.getUnpaid);

module.exports = router;