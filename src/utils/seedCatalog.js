// Seeds the database with materials modeled on Power Palazzo's real product
// lines (Indoor/Outdoor/Smart Drivers, COBs) as published at powerpalazzo.com.
// Exact model numbers and specs aren't public on the site (they're gated
// behind brochure downloads), so SKUs/quantities here are representative —
// edit them in the Stock Management UI to match your actual inventory.

require('dotenv').config();
const connectDB = require('../config/db');
const Material = require('../models/Material');

const OLD_SAMPLE_SKUS = ['IND-012W', 'OUT-036W', 'SMT-024W', 'COB-010W'];

const catalog = [
  // Indoor Drivers
  { name: 'Isolated LPF Driver 12W', sku: 'IND-ISO-LPF-12W', category: 'Indoor Driver', quantityInStock: 200, reorderLevel: 40, unitPrice: 3.8, supplier: 'Surya Electronics Pvt Ltd' },
  { name: 'Isolated LPF Driver 24W', sku: 'IND-ISO-LPF-24W', category: 'Indoor Driver', quantityInStock: 150, reorderLevel: 30, unitPrice: 5.2, supplier: 'Surya Electronics Pvt Ltd' },
  { name: 'Isolated HPF Driver 36W', sku: 'IND-ISO-HPF-36W', category: 'Indoor Driver', quantityInStock: 90, reorderLevel: 25, unitPrice: 7.1, supplier: 'Surya Electronics Pvt Ltd' },
  { name: 'Isolated HPF Driver 50W', sku: 'IND-ISO-HPF-50W', category: 'Indoor Driver', quantityInStock: 18, reorderLevel: 20, unitPrice: 9.4, supplier: 'Surya Electronics Pvt Ltd' },
  { name: 'CCT Changing Driver (Switch Base) 18W', sku: 'IND-CCT-SW-18W', category: 'Indoor Driver', quantityInStock: 75, reorderLevel: 20, unitPrice: 6.3, supplier: 'LumiTech Components' },
  { name: 'CCT Changing Driver (Remote Base) 24W', sku: 'IND-CCT-RM-24W', category: 'Indoor Driver', quantityInStock: 60, reorderLevel: 20, unitPrice: 8.9, supplier: 'LumiTech Components' },
  { name: 'SteadyGlow Flicker-Free Driver 20W', sku: 'IND-SG-20W', category: 'Indoor Driver', quantityInStock: 110, reorderLevel: 25, unitPrice: 6.8, supplier: 'LumiTech Components' },
  { name: 'Indoor Smart Driver 30W', sku: 'IND-SMT-30W', category: 'Indoor Driver', quantityInStock: 40, reorderLevel: 15, unitPrice: 11.5, supplier: 'LumiTech Components' },
  { name: 'Indoor Sensor Driver 15W', sku: 'IND-SEN-15W', category: 'Indoor Driver', quantityInStock: 55, reorderLevel: 15, unitPrice: 7.9, supplier: 'Apex Electronics Ltd' },
  { name: 'Non-Isolated Driver 40W', sku: 'IND-NISO-40W', category: 'Indoor Driver', quantityInStock: 70, reorderLevel: 20, unitPrice: 6.0, supplier: 'Apex Electronics Ltd' },

  // Outdoor Drivers
  { name: 'PPPL Series IP-65 Driver 60W', sku: 'OUT-PPPL65-60W', category: 'Outdoor Driver', quantityInStock: 45, reorderLevel: 15, unitPrice: 13.2, supplier: 'Apex Electronics Ltd' },
  { name: 'PPPL Series IP-65 Driver 100W', sku: 'OUT-PPPL65-100W', category: 'Outdoor Driver', quantityInStock: 12, reorderLevel: 15, unitPrice: 19.5, supplier: 'Apex Electronics Ltd' },
  { name: 'Eco Series CCT Driver 45W', sku: 'OUT-ECO-45W', category: 'Outdoor Driver', quantityInStock: 65, reorderLevel: 20, unitPrice: 10.7, supplier: 'Global Lighting Components' },
  { name: 'IP-67 Flicker-Free Driver 80W', sku: 'OUT-IP67-80W', category: 'Outdoor Driver', quantityInStock: 30, reorderLevel: 15, unitPrice: 16.4, supplier: 'Global Lighting Components' },
  { name: 'RGB Event Driver 36W', sku: 'OUT-RGB-36W', category: 'Outdoor Driver', quantityInStock: 25, reorderLevel: 10, unitPrice: 14.9, supplier: 'Global Lighting Components' },
  { name: 'Outdoor Microwave Sensor Driver 50W', sku: 'OUT-SEN-50W', category: 'Outdoor Driver', quantityInStock: 38, reorderLevel: 15, unitPrice: 12.6, supplier: 'Global Lighting Components' },

  // Smart Drivers
  { name: 'Smart Dimmable Driver 24W (Bluetooth)', sku: 'SMT-BT-24W', category: 'Smart Driver', quantityInStock: 50, reorderLevel: 15, unitPrice: 15.8, supplier: 'LumiTech Components' },

  // COBs / raw components
  { name: 'COB LED Module 10W', sku: 'COB-010W', category: 'COB LED', quantityInStock: 300, reorderLevel: 60, unitPrice: 2.4, supplier: 'Shenzhen COB Technologies' },
  { name: 'COB LED Module 20W', sku: 'COB-020W', category: 'COB LED', quantityInStock: 8, reorderLevel: 40, unitPrice: 4.1, supplier: 'Shenzhen COB Technologies' },
  { name: 'SMD LED Strip 5050 (5m Reel)', sku: 'SMD-5050-5M', category: 'Raw Material', quantityInStock: 500, reorderLevel: 100, unitPrice: 8.75, supplier: 'Shenzhen COB Technologies' },
  { name: 'MCPCB Base Plate (Aluminum, Standard)', sku: 'MCPCB-AL-STD', category: 'Raw Material', quantityInStock: 220, reorderLevel: 50, unitPrice: 1.6, supplier: 'Apex MCPCB Solutions' },
];

async function run() {
  await connectDB();

  await Material.deleteMany({ sku: { $in: OLD_SAMPLE_SKUS } });
  console.log('Removed old placeholder sample materials (if present).');

  let created = 0;
  let skipped = 0;
  for (const item of catalog) {
    const exists = await Material.findOne({ sku: item.sku });
    if (exists) {
      skipped += 1;
      continue;
    }
    await Material.create({ unit: 'pcs', location: 'Main Warehouse', ...item });
    created += 1;
  }

  console.log(`Catalog seeded: ${created} created, ${skipped} already existed.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
