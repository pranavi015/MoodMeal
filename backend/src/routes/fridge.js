const express = require('express');
const router = express.Router();
const { generateFridgeRecipe } = require('../services/aiService');
const { authenticateToken } = require('../middleware/authMid');

// Note: Using authenticateToken if you want to restrict this to logged-in users.
// For now, let's assume it's protected.

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Please provide an array of ingredients." });
    }

    const recipe = await generateFridgeRecipe(ingredients);
    res.json(recipe);
  } catch (error) {
    console.error("Fridge route error:", error);
    res.status(500).json({ error: "Failed to generate recipe." });
  }
});

module.exports = router;
