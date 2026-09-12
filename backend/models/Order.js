const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    variantId: mongoose.Schema.Types.ObjectId,
    size: String,
    color: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestEmail: { type: String, default: '' },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      line1: String,
      city: String,
      province: String,
      postalCode: String,
    },
    paymentMethod: { type: String, enum: ['COD', 'CARD'], default: 'COD' },
    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
      },
    ],
    trackingNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'TFS-' + Math.floor(100000 + Math.random() * 900000);
  }
  if (this.isModified('status') || this.isNew) {
    this.statusHistory.push({ status: this.status, at: new Date() });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
