const express = require('express');

const summaryController = require('../controller/summary_controller')
const checkToken = require('../middleware/check-auth')

const router = express.Router();

router.use(checkToken)

router.post('/', summaryController.StoreSummary)

module.exports = router;