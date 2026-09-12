const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // e.g. S, M, L, XL, Unstitched
    color: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, default: '' },
    fabric: { type: String, default: '' }, // e.g. Lawn, Chiffon, Khaddar, Silk
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    pieces: { type: Number, default: 1 }, // 1/2/3 piece suit
    price: { type: Number, required: true }, // sale price
    compareAtPrice: { type: Number, default: 0 }, // original price (for discount %)
    images: [{ type: String }],
    variants: [variantSchema],
    totalStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    tags: [{ type: String }],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', fabric: 'text', tags: 'text' });

productSchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name + '-' + Math.random().toString(36).slice(2, 7), {
      lower: true,
      strict: true,
    });
  }
  next();
});

productSchema.pre('save', function (next) {
  if (this.variants && this.variants.length) {
    this.totalStock = this.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  next();
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
