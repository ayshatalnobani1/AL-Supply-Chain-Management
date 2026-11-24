const express = require('express');
const router = express.Router();
const productionsController = require('../controllers/productionsController');

router.get('/', productionsController.getAllProductions);
router.get('/:id', productionsController.getProductionById);
router.post('/', productionsController.createProduction);
router.put('/:id', productionsController.updateProduction);
router.delete('/:id', productionsController.deleteProduction);

module.exports = router;
