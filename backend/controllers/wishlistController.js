const User = require('../models/User');

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name slug images price compareAtPrice'
    );
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    let added;
    if (idx >= 0) {
      user.wishlist.splice(idx, 1);
      added = false;
    } else {
      user.wishlist.push(productId);
      added = true;
    }
    await user.save();
    res.json({ added, wishlist: user.wishlist });
  } catch (err) {
    next(err);
  }
};
