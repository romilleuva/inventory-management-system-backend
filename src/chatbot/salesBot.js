const Material = require('../models/Material');
const PurchaseRequest = require('../models/PurchaseRequest');

const HELP_TEXT = `I can help with stock and purchase management. Try:
- "stock <material name>" — check quantity for a material
- "low stock" — list materials at or below reorder level
- "request <qty> <material name>" — create a purchase request
- "requests" or "pending requests" — list purchase requests
- "help" — show this message`;

async function checkStock(name) {
  const materials = await Material.find({ name: { $regex: name, $options: 'i' } }).limit(5);
  if (materials.length === 0) return `No material found matching "${name}".`;
  return materials
    .map((m) => `${m.name} (${m.sku}): ${m.quantityInStock} ${m.unit} in stock, reorder level ${m.reorderLevel}`)
    .join('\n');
}

async function lowStock() {
  const materials = await Material.find();
  const low = materials.filter((m) => m.quantityInStock <= m.reorderLevel);
  if (low.length === 0) return 'No materials are currently below their reorder level.';
  return `Low stock materials:\n${low.map((m) => `- ${m.name} (${m.sku}): ${m.quantityInStock} ${m.unit} left`).join('\n')}`;
}

async function createRequest(user, qty, name) {
  const material = await Material.findOne({ name: { $regex: name, $options: 'i' } });
  if (!material) return `No material found matching "${name}". No purchase request created.`;

  const request = await PurchaseRequest.create({
    material: material._id,
    quantity: qty,
    supplier: material.supplier,
    requestedBy: user._id,
  });
  return `Purchase request created: ${qty} x ${material.name} (status: ${request.status}). Supplier: ${material.supplier || 'not set'}.`;
}

async function listRequests() {
  const requests = await PurchaseRequest.find({ status: { $in: ['pending', 'approved', 'ordered'] } })
    .populate('material', 'name unit')
    .sort({ createdAt: -1 })
    .limit(10);
  if (requests.length === 0) return 'No pending purchase requests.';
  return `Open purchase requests:\n${requests
    .map((r) => `- ${r.quantity} x ${r.material?.name || 'Unknown'} — ${r.status}`)
    .join('\n')}`;
}

async function handleSalesMessage({ user, text }) {
  const textLower = text.trim().toLowerCase();

  if (['help', 'hi', 'hello', '?'].includes(textLower)) return HELP_TEXT;

  if (textLower.includes('low stock')) return lowStock();

  if (textLower.startsWith('stock ')) {
    return checkStock(text.slice(6).trim());
  }

  const requestMatch = text.match(/^request\s+(\d+)\s+(.+)$/i);
  if (requestMatch) {
    const qty = parseInt(requestMatch[1], 10);
    const materialName = requestMatch[2].trim();
    return createRequest(user, qty, materialName);
  }

  if (textLower.includes('request') && (textLower.includes('pending') || textLower === 'requests')) {
    return listRequests();
  }

  return `I didn't understand that. ${HELP_TEXT}`;
}

module.exports = { handleSalesMessage, HELP_TEXT };
