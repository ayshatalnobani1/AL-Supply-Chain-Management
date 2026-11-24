const express = require('express');
const router = express.Router();
const orderStatusController = require('../controllers/orderStatusController');

router.get('/', orderStatusController.getAllOrderStatuses);
router.get('/:id', orderStatusController.getOrderStatusById);
router.post('/', orderStatusController.createOrderStatus);
router.put('/:id', orderStatusController.updateOrderStatus);
router.delete('/:id', orderStatusController.deleteOrderStatus);

module.exports = router;
