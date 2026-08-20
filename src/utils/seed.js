require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Material = require('../models/Material');

async function seed() {
  await connectDB();

  const adminEmail = 'admin@powerpalazzo.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', email: adminEmail, password: 'admin123', role: 'admin' });
    console.log(`Created admin user: ${adminEmail} / admin123 (please change this password)`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  const sampleMaterials = [
    { name: '12W Indoor LED Driver', sku: 'IND-012W', category: 'Indoor Driver', quantityInStock: 150, reorderLevel: 30, unitPrice: 4.5, supplier: 'ACME Components', unit: 'pcs' },
    { name: '36W Outdoor LED Driver', sku: 'OUT-036W', category: 'Outdoor Driver', quantityInStock: 20, reorderLevel: 25, unitPrice: 9.2, supplier: 'ACME Components', unit: 'pcs' },
    { name: 'Smart Dimmable Driver 24W', sku: 'SMT-024W', category: 'Smart Driver', quantityInStock: 60, reorderLevel: 15, unitPrice: 12.75, supplier: 'BrightTech Supplies', unit: 'pcs' },
    { name: 'COB LED Module 10W', sku: 'COB-010W', category: 'COB LED', quantityInStock: 8, reorderLevel: 20, unitPrice: 3.1, supplier: 'BrightTech Supplies', unit: 'pcs' },
  ];

  for (const m of sampleMaterials) {
    const exists = await Material.findOne({ sku: m.sku });
    if (!exists) await Material.create(m);
  }
  console.log('Sample materials ensured.');

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
