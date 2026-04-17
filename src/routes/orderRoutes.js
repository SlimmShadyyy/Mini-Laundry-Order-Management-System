// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const requireAuth = require('../middleware/auth'); // This is what was crashing!

// Apply authentication middleware to all routes
router.use(requireAuth); 

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.patch('/:id/status', orderController.updateOrderStatus);
router.get('/dashboard', orderController.getDashboard);

module.exports = router;