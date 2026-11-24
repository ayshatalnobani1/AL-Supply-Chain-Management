const express = require('express');
const router = express.Router();
const supplierOrdersController = require('../controllers/supplier_ordersController');

router.get('/', supplierOrdersController.getAllSupplierOrders);
router.get('/:id', supplierOrdersController.getSupplierOrderById);
router.post('/', supplierOrdersController.createSupplierOrder);
router.put('/:id', supplierOrdersController.updateSupplierOrder);
router.delete('/:id', supplierOrdersController.deleteSupplierOrder);

module.exports = router;
