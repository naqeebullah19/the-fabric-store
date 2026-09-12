const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateCart = (cartQuery) =>
  cartQuery.populate('items.product', 'name slug images price compareAtPrice totalStock');

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    cart = await populateCart(Cart.findById(cart._id));
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const variant = product.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: 'Variant not found' });
    if (variant.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock for this size/color' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find((i) => i.variantId.toString() === variantId);
    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        variantId,
        size: variant.size,
        color: variant.color,
        quantity,
        priceAtAdd: product.price,
      });
    }
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();
    const populated = await populateCart(Cart.findById(cart._id));
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};
