const express = require('express');
const {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  adjustStock,
  listMovements,
} = require('../controllers/materialController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireRole('admin', 'stock', 'sales'));

router.get('/', listMaterials);
router.get('/movements', listMovements);
router.get('/:id', getMaterial);
router.post('/', requireRole('admin', 'stock'), createMaterial);
router.put('/:id', requireRole('admin', 'stock'), updateMaterial);
router.delete('/:id', requireRole('admin', 'stock'), deleteMaterial);
router.post('/:id/adjust', requireRole('admin', 'stock'), adjustStock);

module.exports = router;
