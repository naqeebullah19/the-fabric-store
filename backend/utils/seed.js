/**
 * The Fabric Store (TFS) Catalog Seeder
 * Populates MongoDB with authentic categories, unstitched & pret catalog items,
 * and default super-admin credentials.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const categories = [
  { name: 'Unstitched', description: 'Unstitched fabric suits — printed, embroidered, embellished', sortOrder: 1 },
  { name: 'Ready To Wear', description: 'Pret / stitched suits ready to wear', sortOrder: 2 },
  { name: 'Formal', description: 'Chiffon & net luxury formal wear', sortOrder: 3 },
  { name: 'Shawl', description: 'Winter & summer luxury shawls', sortOrder: 4 },
  { name: 'Sale', description: 'Special seasonal discounts & stock clearance', sortOrder: 0 },
  { name: 'New Arrivals', description: 'Freshly arrived collection edits', sortOrder: 5 },
];

// Curated high-resolution fashion photography sets with front & detailed secondary shots
const FASHION_IMAGE_SETS = [
  [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1550614000-4b95d4edfa92?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=85',
  ],
  [
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
  ],
];

const colors = ['Crimson Red', 'Emerald Green', 'Royal Navy', 'Ivory White', 'Jet Black', 'Mustard Gold', 'Blush Pink', 'Lilac Purple'];
const sizes = ['S', 'M', 'L', 'XL'];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeVariants(unstitched) {
  if (unstitched) {
    return [
      { size: 'Unstitched', color: colors[randomBetween(0, 3)], stock: randomBetween(12, 35) },
      { size: 'Unstitched', color: colors[randomBetween(4, colors.length - 1)], stock: randomBetween(8, 20) },
    ];
  }
  return sizes.map((size) => ({
    size,
    color: colors[randomBetween(0, colors.length - 1)],
    stock: randomBetween(4, 18),
  }));
}

const catalog = [
  { name: 'Printed Lawn 3 Pcs (Unstitched)', category: 'Unstitched', fabric: 'Lawn', pieces: 3, price: 3849, compareAtPrice: 5499, unstitched: true, isNewArrival: true },
  { name: 'Embroidered & Embellished Chiffon 3 Pcs', category: 'Unstitched', fabric: 'Chiffon', pieces: 3, price: 10799, compareAtPrice: 17999, unstitched: true, isFeatured: true },
  { name: 'Embroidered Chiffon 3 Pcs (Festive Edition)', category: 'Unstitched', fabric: 'Chiffon', pieces: 3, price: 8399, compareAtPrice: 13999, unstitched: true, isBestSeller: true },
  { name: 'Printed & Embellished Lawn 2 Pcs', category: 'Unstitched', fabric: 'Lawn', pieces: 2, price: 3899, compareAtPrice: 6499, unstitched: true, isNewArrival: true },
  { name: 'Printed Lawn 2 Pcs (Everyday Edit)', category: 'Unstitched', fabric: 'Lawn', pieces: 2, price: 3359, compareAtPrice: 5599, unstitched: true },
  { name: 'Printed Lawn Shirt 1 Pcs', category: 'Unstitched', fabric: 'Lawn', pieces: 1, price: 1319, compareAtPrice: 2199, unstitched: true },
  { name: 'Embroidered Luxury Lawn 3 Pcs', category: 'Unstitched', fabric: 'Lawn', pieces: 3, price: 6899, compareAtPrice: 11499, unstitched: true, isFeatured: true },
  { name: 'Printed Slub Khaddar 2 Pcs', category: 'Unstitched', fabric: 'Khaddar', pieces: 2, price: 2450, compareAtPrice: 4899, unstitched: true },
  { name: 'Embroidered Karandi Lawn 2 Pcs', category: 'Unstitched', fabric: 'Karandi', pieces: 2, price: 4199, compareAtPrice: 6999, unstitched: true, isBestSeller: true },
  { name: 'Printed Indian Silk Kurti 1 Pcs', category: 'Ready To Wear', fabric: 'Silk', pieces: 1, price: 1499, compareAtPrice: 2499, isNewArrival: true },
  { name: 'Printed Poly Chiffon Shirt', category: 'Ready To Wear', fabric: 'Chiffon', pieces: 1, price: 1799, compareAtPrice: 2999 },
  { name: 'Pret Printed Lawn 3 Pcs Suit', category: 'Ready To Wear', fabric: 'Lawn', pieces: 3, price: 6599, compareAtPrice: 10999, isFeatured: true },
  { name: 'Embroidered Cambric Plazo Set', category: 'Ready To Wear', fabric: 'Cambric', pieces: 2, price: 2919, compareAtPrice: 4199 },
  { name: 'Pret Embroidered & Printed Lawn 3 Pcs', category: 'Ready To Wear', fabric: 'Lawn', pieces: 3, price: 7499, compareAtPrice: 12499, isBestSeller: true },
  { name: 'Pret Solid Jacquard 2 Pcs Co-ord', category: 'Ready To Wear', fabric: 'Jacquard', pieces: 2, price: 5099, compareAtPrice: 8499, isNewArrival: true },
  { name: 'Pret Solid Karandi Lawn 2 Pcs', category: 'Ready To Wear', fabric: 'Karandi', pieces: 2, price: 4499, compareAtPrice: 7499 },
  { name: 'Plain Dyed Khaddar Trouser', category: 'Ready To Wear', fabric: 'Khaddar', pieces: 1, price: 1134, compareAtPrice: 1890 },
  { name: 'Embroidered & Embellished Chiffon 3 Pcs Formal', category: 'Formal', fabric: 'Chiffon', pieces: 3, price: 9599, compareAtPrice: 15999, isFeatured: true },
  { name: 'Embroidered Chiffon 2 Pcs Formal', category: 'Formal', fabric: 'Chiffon', pieces: 2, price: 6959, compareAtPrice: 11599 },
  { name: 'Embroidered Net & Chiffon 3 Pcs Luxury', category: 'Formal', fabric: 'Net', pieces: 3, price: 12999, compareAtPrice: 18999, isFeatured: true, isNewArrival: true },
  { name: 'Nepali Wool Shawl 1 Pcs', category: 'Shawl', fabric: 'Wool', pieces: 1, price: 4919, compareAtPrice: 8199, unstitched: true, isBestSeller: true },
  { name: 'Semi Pashmina Embroidered Shawl', category: 'Shawl', fabric: 'Pashmina', pieces: 1, price: 2699, compareAtPrice: 4499, unstitched: true },
  { name: 'Soft Cashmere Touch Wool Shawl', category: 'Shawl', fabric: 'Wool', pieces: 1, price: 3359, compareAtPrice: 5599, unstitched: true },
  { name: 'Embroidered Karandi Shawl 1 Pcs', category: 'Shawl', fabric: 'Karandi', pieces: 1, price: 5699, compareAtPrice: 9499, unstitched: true, isNewArrival: true },
  { name: 'Moon Light Velvet Touch Shawl', category: 'Shawl', fabric: 'Velvet', pieces: 1, price: 4539, compareAtPrice: 6899, unstitched: true, isFeatured: true },
  { name: 'Yarn Dyed Pure Wool Shawl', category: 'Shawl', fabric: 'Wool', pieces: 1, price: 3839, compareAtPrice: 6399, unstitched: true },
];

async function seedDatabase(options = {}) {
  const { clearExisting = true } = options;

  if (clearExisting) {
    console.log('Resetting categories & products collections...');
    await Category.deleteMany({});
    await Product.deleteMany({});
  }

  console.log('Seeding TFS categories...');
  const createdCategories = await Category.insertMany(categories);
  const catMap = Object.fromEntries(createdCategories.map((c) => [c.name, c]));

  console.log(`Seeding ${catalog.length} TFS catalog products...`);
  let i = 0;
  for (const item of catalog) {
    const category = catMap[item.category] || createdCategories[0];
    const imgSet = FASHION_IMAGE_SETS[i % FASHION_IMAGE_SETS.length];
    i += 1;

    const isSale = item.compareAtPrice > item.price;
    await Product.create({
      name: item.name,
      description: `${item.name} — Premium ${item.fabric} fabric, ${item.pieces} piece suit with authentic Pakistani detailing. Ideal for seasonal elegance, casual ease or formal gatherings.`,
      fabric: item.fabric,
      category: category._id,
      pieces: item.pieces,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      images: imgSet,
      variants: makeVariants(item.unstitched),
      isFeatured: Boolean(item.isFeatured || i % 4 === 0),
      isBestSeller: Boolean(item.isBestSeller || i % 3 === 0),
      isNewArrival: Boolean(item.isNewArrival || i % 2 === 0),
      tags: [item.fabric, item.category, isSale ? 'sale' : '', 'summer', 'festive'].filter(Boolean),
      ratingAverage: (4.2 + (i % 7) * 0.1).toFixed(1),
      ratingCount: 8 + (i % 15) * 3,
    });
  }

  console.log('Ensuring default super-admin account...');
  const adminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@tfsclone.com').toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'TFS Store Admin',
      email: adminEmail,
      password: process.env.SUPER_ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'superadmin',
    });
    console.log(`Super-admin account ready: ${adminEmail}`);
  }

  console.log('TFS Database seeded successfully!');
}

async function run() {
  const connectDB = require('../config/db');
  await connectDB();
  await seedDatabase({ clearExisting: true });
  await mongoose.disconnect();
  process.exit(0);
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Seed script error:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
