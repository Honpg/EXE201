const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { checkAuth } = require('../middleware/authMiddleware');
const plans = require('../config/plans');

router.post('/purchase', checkAuth, async (req, res) => {
  try {
    const { planName, price } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      planName,
      price
    });
    res.json({ message: 'Plan purchased', transaction });
  } catch (err) {
    res.status(400).json({ message: 'Purchase failed', error: err.message });
  }
});

router.get('/', (req, res) => {
  res.json(plans);
});

module.exports = router;
