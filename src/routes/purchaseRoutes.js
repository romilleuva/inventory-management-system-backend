const express = require('express');
const {
  listPurchaseRequests,
  createPurchaseRequest,
  updatePurchaseRequestStatus,
} = require('../controllers/purchaseController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin', 'sales', 'stock'));

router.get('/', listPurchaseRequests);
router.post('/', createPurchaseRequest);
router.patch('/:id/status', updatePurchaseRequestStatus);

module.exports = router;
