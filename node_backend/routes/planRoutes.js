const router = require('express').Router();
const Transaction = require('../models/Transaction');
const { checkAuth } = require('../middleware/authMiddleware');
const plans = require('../config/plans');

// Mua plan (chỉ user)
router.post('/purchase', checkAuth, async (req, res) => {
  try {
    // Chỉ user mới được mua plan, admin không cần
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admin cannot purchase plans' });
    }
    
    const { planName, price } = req.body;
    
    // Kiểm tra plan có hợp lệ không
    const validPlan = plans.find(plan => plan.name === planName && plan.price === price);
    if (!validPlan) {
      return res.status(400).json({ message: 'Invalid plan' });
    }
    
    const transaction = await Transaction.create({
      user: req.user._id,
      planName,
      price
    });
    
    res.json({ message: 'Plan purchased successfully', transaction });
  } catch (err) {
    res.status(400).json({ message: 'Purchase failed', error: err.message });
  }
});

// Lấy danh sách plans
router.get('/', (req, res) => {
  res.json(plans);
});

// Lấy lịch sử mua plan của user hiện tại
router.get('/my-plans', checkAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
});

module.exports = router;
