const express = require('express');
const router = express.Router();
const productionRecipesController = require('../controllers/production_recipesController');

router.get('/', productionRecipesController.getAllProductionRecipes);
router.get('/:id', productionRecipesController.getRecipeById);
router.post('/', productionRecipesController.createRecipe);
router.put('/:id', productionRecipesController.updateRecipe);
router.delete('/:id', productionRecipesController.deleteRecipe);

module.exports = router;
