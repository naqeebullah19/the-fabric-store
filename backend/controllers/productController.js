const Product = require('../models/Product');
const Category = require('../models/Category');

// GET /api/products  - list with filters, sorting, pagination
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category, // slug
      size,
      color,
      fabric,
      pieces,
      inStock,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20,
      featured,
      bestSeller,
      newArrival,
    } = req.query;

    const filter = { isActive: true };

    if (category) {
      if (category === 'sale') {
        filter.$or = [
          { $expr: { $gt: ['$compareAtPrice', '$price'] } },
          { tags: { $in: ['sale', 'Sale', 'SALE'] } },
        ];
      } else if (category === 'new-arrivals') {
        filter.isNewArrival = true;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) filter.category = cat._id;
        else return res.json({ products: [], total: 0, page: 1, pages: 0 });
      }
    }

    if (size) filter['variants.size'] = size;
    if (color) filter['variants.color'] = new RegExp(`^${color}$`, 'i');

    if (fabric) {
      const fabricList = fabric.split(',').map((f) => f.trim()).filter(Boolean);
      if (fabricList.length === 1) {
        filter.fabric = new RegExp(`^${fabricList[0]}$`, 'i');
      } else if (fabricList.length > 1) {
        filter.fabric = { $in: fabricList.map((f) => new RegExp(`^${f}$`, 'i')) };
      }
    }

    if (pieces) {
      const pieceList = pieces.split(',').map((p) => Number(p)).filter((n) => !isNaN(n));
      if (pieceList.length === 1) {
        filter.pieces = pieceList[0];
      } else if (pieceList.length > 1) {
        filter.pieces = { $in: pieceList };
      }
    }

    if (inStock === 'true') {
      filter.totalStock = { $gt: 0 };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') filter.isFeatured = true;
    if (bestSeller === 'true') filter.isBestSeller = true;
    if (newArrival === 'true') filter.isNewArrival = true;

    const sortMap = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { ratingAverage: -1 },
      bestSeller: { isBestSeller: -1, createdAt: -1 },
      featured: { isFeatured: -1, createdAt: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(60, Number(limit));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/search?q=
exports.searchProducts = async (req, res, next) => {
  try {
    const { q = '', page = 1, limit = 20 } = req.query;
    if (!q.trim()) return res.json({ products: [], total: 0, page: 1, pages: 0 });

    const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'i');
    const filter = {
      isActive: true,
      $or: [
        { name: regex },
        { description: regex },
        { fabric: regex },
        { tags: regex },
      ],
    };
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(60, Number(limit));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
      'category',
      'name slug'
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ADMIN: create product (multipart/form-data with images[] or JSON imageUrls)
exports.createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
    if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim());

    let imgList = [];
    if (body.images) {
      if (Array.isArray(body.images)) imgList = body.images;
      else if (typeof body.images === 'string') {
        try {
          const parsed = JSON.parse(body.images);
          imgList = Array.isArray(parsed) ? parsed : [body.images];
        } catch {
          imgList = body.images.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
        }
      }
    }
    if (body.imageUrls) {
      const urls = typeof body.imageUrls === 'string'
        ? body.imageUrls.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean)
        : body.imageUrls;
      imgList = [...imgList, ...urls];
    }

    if (req.files && req.files.length) {
      const uploaded = req.files.map((f) => f.path || `/uploads/${f.filename}`);
      imgList = [...imgList, ...uploaded];
    }

    body.images = imgList.length ? imgList : ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=80'];

    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.variants === 'string') body.variants = JSON.parse(body.variants);
    if (typeof body.tags === 'string') body.tags = body.tags.split(',').map((t) => t.trim());

    if (body.images && typeof body.images === 'string') {
      try {
        body.images = JSON.parse(body.images);
      } catch {
        body.images = body.images.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean);
      }
    }
    if (body.imageUrls) {
      const urls = typeof body.imageUrls === 'string'
        ? body.imageUrls.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean)
        : body.imageUrls;
      body.images = urls;
    }

    if (req.files && req.files.length) {
      const uploaded = req.files.map((f) => f.path || `/uploads/${f.filename}`);
      body.images = body.images ? [...body.images, ...uploaded] : uploaded;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// ADMIN: list all (including inactive) for admin table
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = {};
    if (q) filter.name = new RegExp(q, 'i');
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
};
