const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', ctrl.getCategories);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), ctrl.getAllCategoriesAdmin);
router.get('/:slug', ctrl.getCategoryBySlug);
router.post('/', protect, authorize('admin', 'superadmin'), ctrl.createCategory);
router.put('/:id', protect, authorize('admin', 'superadmin'), ctrl.updateCategory);
router.delete('/:id', protect, authorize('admin', 'superadmin'), ctrl.deleteCategory);

module.exports = router;
