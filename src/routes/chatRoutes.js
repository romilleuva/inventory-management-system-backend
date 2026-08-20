const express = require('express');
const { customerChat, salesChat, history } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public customer chatbot
router.post('/customer', customerChat);
router.get('/customer/:sessionId/history', (req, res) =>
  history({ ...req, params: { botType: 'customer', sessionId: req.params.sessionId } }, res)
);

// Staff-only inner sales / purchase management chatbot
router.post('/sales', requireAuth, salesChat);
router.get('/sales/:sessionId/history', requireAuth, (req, res) =>
  history({ ...req, params: { botType: 'sales', sessionId: req.params.sessionId } }, res)
);

module.exports = router;
