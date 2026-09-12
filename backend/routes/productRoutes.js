const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', ctrl.getProducts);
router.get('/search', ctrl.searchProducts);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), ctrl.getAllProductsAdmin);
router.get('/id/:id', ctrl.getProductById);
router.get('/:slug', ctrl.getProductBySlug);

router.post(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  upload.array('images', 6),
  ctrl.createProduct
);
router.put(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  upload.array('images', 6),
  ctrl.updateProduct
);
router.delete('/:id', protect, authorize('admin', 'superadmin'), ctrl.deleteProduct);

module.exports = router;
