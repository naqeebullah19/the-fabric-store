const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

// Public / Guest accessible
router.post('/', optionalAuth, ctrl.createOrder);
router.get('/track', ctrl.trackOrder);
router.get('/lookup/:id', ctrl.lookupOrder);

// Authenticated user
router.get('/my', protect, ctrl.getMyOrders);
router.get('/my/:id', protect, ctrl.getMyOrderById);

// Admin
router.get('/admin/stats', protect, authorize('admin', 'superadmin'), ctrl.getDashboardStats);
router.get('/admin/all', protect, authorize('admin', 'superadmin'), ctrl.getAllOrders);
router.get('/admin/:id', protect, authorize('admin', 'superadmin'), ctrl.getOrderByIdAdmin);
router.put('/admin/:id/status', protect, authorize('admin', 'superadmin'), ctrl.updateOrderStatus);

module.exports = router;
