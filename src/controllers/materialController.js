const Material = require('../models/Material');
const StockMovement = require('../models/StockMovement');

const CATEGORY_PREFIX = {
  'Indoor Driver': 'IND',
  'Outdoor Driver': 'OUT',
  'Smart Driver': 'SMT',
  'COB LED': 'COB',
  'Raw Material': 'RAW',
  Other: 'OTH',
};

async function generateSku(category) {
  const prefix = CATEGORY_PREFIX[category] || 'OTH';
  let sku;
  let exists = true;
  while (exists) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    sku = `${prefix}-${suffix}`;
    exists = await Material.exists({ sku });
  }
  return sku;
}

async function listMaterials(req, res) {
  const { category, lowStock, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  let materials = await Material.find(filter).sort({ name: 1 });
  if (lowStock === 'true') {
    materials = materials.filter((m) => m.quantityInStock <= m.reorderLevel);
  }
  res.json(materials);
}

async function getMaterial(req, res) {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json(material);
}

async function createMaterial(req, res) {
  const sku = req.body.sku?.trim() || (await generateSku(req.body.category));
  const material = await Material.create({ ...req.body, sku });
  res.status(201).json(material);
}

async function updateMaterial(req, res) {
  const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json(material);
}

async function deleteMaterial(req, res) {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json({ message: 'Material deleted' });
}

async function adjustStock(req, res) {
  const { type, quantity, reason } = req.body;
  if (!['in', 'out'].includes(type) || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'type must be "in" or "out" and quantity must be positive' });
  }

  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });

  if (type === 'out' && material.quantityInStock < quantity) {
    return res.status(400).json({ message: 'Not enough stock available' });
  }

  material.quantityInStock += type === 'in' ? quantity : -quantity;
  await material.save();

  const movement = await StockMovement.create({
    material: material._id,
    type,
    quantity,
    reason,
    performedBy: req.user._id,
  });

  res.json({ material, movement });
}

async function listMovements(req, res) {
  const filter = {};
  if (req.query.material) filter.material = req.query.material;
  const movements = await StockMovement.find(filter)
    .populate('material', 'name sku')
    .populate('performedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(movements);
}

module.exports = {
  listMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  adjustStock,
  listMovements,
};
