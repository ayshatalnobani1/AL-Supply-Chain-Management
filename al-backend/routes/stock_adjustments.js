const express = require('express');
const router = express.Router();
const stockAdjustmentsController = require('../controllers/stock_adjustmentsController');

router.get('/', stockAdjustmentsController.getAllStockAdjustments);
router.get('/:id', stockAdjustmentsController.getStockAdjustmentById);
router.post('/', stockAdjustmentsController.createStockAdjustment);
router.put('/:id', stockAdjustmentsController.updateStockAdjustment);
router.delete('/:id', stockAdjustmentsController.deleteStockAdjustment);

module.exports = router;
