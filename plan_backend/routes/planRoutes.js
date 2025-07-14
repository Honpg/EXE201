const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

router.post('/purchase', auth, async (req, res) => {
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

module.exports = router;
