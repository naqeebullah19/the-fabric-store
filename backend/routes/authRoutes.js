const router = require('express').Router();
const { register, login, me, createAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
// Super-admin only: create new admin accounts
router.post('/create-admin', protect, authorize('superadmin'), createAdmin);

module.exports = router;
