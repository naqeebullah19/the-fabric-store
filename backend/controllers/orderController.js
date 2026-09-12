const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const SHIPPING_FEE = 250;
const FREE_SHIPPING_THRESHOLD = 3000;

exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'COD', items: bodyItems, guestEmail } = req.body;
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Shipping address with full name and phone is required' });
    }

    let rawItems = bodyItems;
    let userCart = null;

    if (req.user && (!rawItems || rawItems.length === 0)) {
      userCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      if (userCart && userCart.items.length > 0) {
        rawItems = userCart.items.map((i) => ({
          productId: i.product?._id || i.product,
          variantId: i.variantId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        }));
      }
    }

    if (!rawItems || rawItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock & build order items
    const orderItems = [];
    const stockToDeduct = [];

    for (const item of rawItems) {
      const pId = item.productId || item.product?._id || item.product;
      if (!pId || !/^[0-9a-fA-F]{24}$/.test(String(pId))) {
        return res.status(400).json({ message: 'One of the products in your bag is no longer available. Please refresh your bag.' });
      }
      const product = await Product.findById(pId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product is no longer available` });
      }
      const variant = product.variants.id(item.variantId) || product.variants[0];
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (${variant?.size || ''} / ${variant?.color || ''})`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        variantId: variant._id,
        size: variant.size,
        color: variant.color,
        quantity: item.quantity,
        price: product.price,
      });

      stockToDeduct.push({ product, variant, quantity: item.quantity });
    }

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = itemsTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = itemsTotal + shippingFee;

    const order = await Order.create({
      user: req.user ? req.user._id : undefined,
      guestEmail: guestEmail || '',
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsTotal,
      shippingFee,
      total,
      status: 'Pending',
    });

    // Decrement stock
    for (const { product, variant, quantity } of stockToDeduct) {
      variant.stock = Math.max(0, variant.stock - quantity);
      await product.save();
    }

    // Clear user cart if logged in
    if (userCart) {
      userCart.items = [];
      await userCart.save();
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, phone } = req.query;
    if (!orderNumber) return res.status(400).json({ message: 'Order number is required' });
    const cleanNum = orderNumber.trim();
    const filter = {
      $or: [
        { orderNumber: new RegExp(`^${cleanNum}$`, 'i') },
        ...(cleanNum.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanNum }] : []),
      ],
    };
    if (phone && phone.trim()) {
      filter['shippingAddress.phone'] = new RegExp(phone.trim().slice(-7));
    }
    const order = await Order.findOne(filter);
    if (!order) return res.status(404).json({ message: 'Order not found with provided details' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.lookupOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ADMIN
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

exports.getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (status) order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// ADMIN dashboard stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenueAgg, pendingOrders, totalProducts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, revenue: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ status: 'Pending' }),
      require('../models/Product').countDocuments(),
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenueAgg[0]?.revenue || 0,
      pendingOrders,
      totalProducts,
    });
  } catch (err) {
    next(err);
  }
};
