// Seeds staff accounts for each role, plus sample purchase requests and
// customer inquiries, so the sales chatbot / stock pages have realistic
// data to demo beyond just the material catalog.

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Material = require('../models/Material');
const PurchaseRequest = require('../models/PurchaseRequest');
const Inquiry = require('../models/Inquiry');

const staffUsers = [
  { name: 'Admin', email: 'admin@powerpalazzo.com', password: 'admin123', role: 'admin' },
  { name: 'Riya Shah', email: 'sales@powerpalazzo.com', password: 'sales123', role: 'sales' },
  { name: 'Karan Mehta', email: 'stock@powerpalazzo.com', password: 'stock123', role: 'stock' },
];

const sampleInquiries = [
  { name: 'Vikram Desai', email: 'vikram.desai@example.com', phone: '+91 98200 11223', message: 'Interested in outdoor LED drivers for a street lighting project, need pricing for 60W PPPL Series.', status: 'new' },
  { name: 'Anita Rao', email: 'anita.rao@example.com', phone: '+91 90040 55667', message: 'Looking for a quote on Smart Dimmable Driver 24W for a hospitality project, 200 units.', status: 'contacted' },
  { name: 'Farhan Sheikh', email: 'farhan.sheikh@example.com', phone: '+91 99870 33445', message: 'Do you supply COB LED modules for a transportation lighting retrofit? Need spec sheet.', status: 'new' },
];

async function run() {
  await connectDB();

  const createdUsers = {};
  for (const u of staffUsers) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      user = await User.create(u);
      console.log(`Created ${u.role} user: ${u.email} / ${u.password}`);
    } else {
      console.log(`${u.role} user already exists: ${u.email}`);
    }
    createdUsers[u.role] = user;
  }

  const materials = await Material.find({
    sku: { $in: ['OUT-PPPL65-100W', 'COB-020W', 'IND-ISO-HPF-50W'] },
  });

  const requestPlan = [
    { sku: 'OUT-PPPL65-100W', quantity: 100, status: 'pending', requestedBy: 'sales' },
    { sku: 'COB-020W', quantity: 500, status: 'approved', requestedBy: 'stock' },
    { sku: 'IND-ISO-HPF-50W', quantity: 200, status: 'ordered', requestedBy: 'admin' },
  ];

  let requestsCreated = 0;
  for (const plan of requestPlan) {
    const material = materials.find((m) => m.sku === plan.sku);
    if (!material) continue;
    const exists = await PurchaseRequest.findOne({ material: material._id, status: plan.status });
    if (exists) continue;
    await PurchaseRequest.create({
      material: material._id,
      quantity: plan.quantity,
      supplier: material.supplier,
      status: plan.status,
      requestedBy: createdUsers[plan.requestedBy]._id,
      notes: 'Auto-generated demo purchase request',
    });
    requestsCreated += 1;
  }
  console.log(`Purchase requests seeded: ${requestsCreated} created.`);

  let inquiriesCreated = 0;
  for (const inq of sampleInquiries) {
    const exists = await Inquiry.findOne({ email: inq.email });
    if (exists) continue;
    await Inquiry.create({ ...inq, sessionId: `demo-${inq.email}` });
    inquiriesCreated += 1;
  }
  console.log(`Customer inquiries seeded: ${inquiriesCreated} created.`);

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
