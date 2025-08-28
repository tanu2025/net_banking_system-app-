const express = require('express');
const router = express.Router();
const { sendMoney, getLastFiveTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/send', protect, sendMoney);
router.get('/last-five', protect, getLastFiveTransactions);

module.exports = router;