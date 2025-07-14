const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { checkAuth, authorize } = require('../middleware/authMiddleware');

router.get('/transactions', checkAuth, authorize(['admin']), async (req, res) => {
  const transactions = await Transaction.find().populate('user', 'name email role');
  res.json(transactions);
});

module.exports = router;
