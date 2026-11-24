const express = require('express');
const router = express.Router();
const inventoryMovementsController = require('../controllers/inventory_movementsController');

router.get('/', inventoryMovementsController.getAllInventoryMovements);
router.get('/:id', inventoryMovementsController.getInventoryMovementById);
router.post('/', inventoryMovementsController.createInventoryMovement);
router.put('/:id', inventoryMovementsController.updateInventoryMovement);
router.delete('/:id', inventoryMovementsController.deleteInventoryMovement);

module.exports = router;
