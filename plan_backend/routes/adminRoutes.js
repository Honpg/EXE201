const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');

router.get('/transactions', auth, authorize(['admin']), async (req, res) => {
  const transactions = await Transaction.find().populate('user', 'name email role');
  res.json(transactions);
});

module.exports = router;
