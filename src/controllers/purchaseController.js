const PurchaseRequest = require('../models/PurchaseRequest');
const Material = require('../models/Material');

async function listPurchaseRequests(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const requests = await PurchaseRequest.find(filter)
    .populate('material', 'name sku unit')
    .populate('requestedBy', 'name')
    .sort({ createdAt: -1 });
  res.json(requests);
}

async function createPurchaseRequest(req, res) {
  const { material, quantity, supplier, notes } = req.body;
  const materialDoc = await Material.findById(material);
  if (!materialDoc) return res.status(404).json({ message: 'Material not found' });

  const request = await PurchaseRequest.create({
    material,
    quantity,
    supplier: supplier || materialDoc.supplier,
    notes,
    requestedBy: req.user._id,
  });
  await request.populate('material', 'name sku unit');
  res.status(201).json(request);
}

async function updatePurchaseRequestStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending', 'approved', 'ordered', 'received', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${allowed.join(', ')}` });
  }

  const request = await PurchaseRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Purchase request not found' });

  request.status = status;
  await request.save();

  if (status === 'received') {
    await Material.findByIdAndUpdate(request.material, {
      $inc: { quantityInStock: request.quantity },
    });
  }

  res.json(request);
}

module.exports = { listPurchaseRequests, createPurchaseRequest, updatePurchaseRequestStatus };
