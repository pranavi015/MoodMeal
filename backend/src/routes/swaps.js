const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/authMid');
const { generateHealthySwap, generateSwapRecipe } = require('../services/aiService');

const prisma = new PrismaClient();

//swap database
const swapDatabase = {
  pizza: ['Whole-wheat roti pizza with veggies', 'Paneer tikka open toast', 'Tandoori mushroom open sandwich'],
  chocolate: ['Ragi (finger millet) cocoa ladoo', 'Date & cacao balls (khajoor bites)', 'Jaggery dark chocolate bark', 'Almond-cocoa chikki'],
  chips: ['Baked veggie chips', 'Air-popped popcorn', 'Roasted chickpeas'],
  icecream: ['Kulfi made with almond milk', 'Frozen mango shrikhand', 'Greek yogurt with berries', 'Frozen yogurt bar'],
  burger: ['Grilled chicken burger', 'Spicy tofu burger', 'Quinoa veggie burger'],
  fries: ['Baked masala banana chips', 'Baked sweet potato fries', 'Zucchini fries', 'Carrot sticks with hummus'],
  candy: ['Dried fruit', 'Trail mix with nuts', 'Yogurt-covered raisins'],
  cookies: ['Oatmeal cookies', 'Protein cookies', 'Rice cakes with almond butter'],
  cake: ['Banana bread', 'Greek yogurt parfait', 'Mini protein muffins'],
  pasta: ['Zucchini noodles', 'Chickpea pasta', 'Whole-wheat pasta'],
  donut: ['Baked donut', 'Whole-grain muffin', 'Apple slices with peanut butter'],
  coffee: ['Iced latte with almond milk', 'Matcha latte', 'Black coffee with cinnamon'],
  soda: ['Fresh Lime Juice', 'Lemon-mint infused water'],
};

router.get('/search', authenticateToken, (req, res) => {
  const { food } = req.query;

  if (!food) {
    return res.status(400).json({ error: 'Food item is required' });
  }


  const searchTerm = food.toLowerCase().replace(/\s+/g, '');

  // find match logic
  const matchedKey = Object.keys(swapDatabase).find(key =>
    searchTerm.includes(key) || key.includes(searchTerm)
  );

  if (matchedKey) {
    const suggestions = swapDatabase[matchedKey].map((alternative, index) => ({
      id: `preset_${matchedKey}_${index}`,
      originalFood: food,
      healthyAlternative: alternative,
      isPreset: true
    }));

    return res.json({
      success: true,
      found: true,
      originalFood: food,
      suggestions
    });
  }

  res.json({
    success: true,
    found: false,
    message: 'No preset swaps found. You can create your own!'
  });
});

//create
router.post('/ai-swap', authenticateToken, async (req, res) => {
  try {
    const { craving } = req.body;
    if (!craving) {
      return res.status(400).json({ error: 'Craving is required' });
    }
    
    const swapResult = await generateHealthySwap(craving);
    res.json({
      success: true,
      swap: swapResult
    });
  } catch (error) {
    console.error('AI Swap Error:', error);
    res.status(500).json({ error: 'Failed to generate healthy swap via AI' });
  }
});

//create recipe
router.post('/ai-recipe', authenticateToken, async (req, res) => {
  try {
    const { suggestion } = req.body;
    if (!suggestion) {
      return res.status(400).json({ error: 'Suggestion is required' });
    }
    
    const recipeResult = await generateSwapRecipe(suggestion);
    res.json({
      success: true,
      recipe: recipeResult
    });
  } catch (error) {
    console.error('AI Recipe Error:', error);
    res.status(500).json({ error: 'Failed to generate recipe via AI' });
  }
});

//create
router.post('/', authenticateToken, async (req, res) => {
  const { originalFood, healthyAlternative, description } = req.body;

  if (!originalFood || !healthyAlternative) {
    return res.status(400).json({
      error: 'Original food and healthy alternative are required'
    });
  }

  try {
    const swap = await prisma.cravingSwaps.create({
      data: {
        userId: req.user.id,
        originalFood,
        healthyAlternative,
        description: description || null,
        cravingType: 'custom'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Custom swap created successfully',
      swap
    });
  } catch (error) {
    console.error('Error creating swap:', error);
    res.status(500).json({ error: 'Failed to create swap' });
  }
});

//read
router.get('/', authenticateToken, async (req, res) => {
  try {
    const swaps = await prisma.cravingSwaps.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      swaps
    });
  } catch (error) {
    console.error('Error fetching swaps:', error);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

//read
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const swap = await prisma.cravingSwaps.findUnique({
      where: { id: parseInt(id) }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ success: true, swap });
  } catch (error) {
    console.error('Error fetching swap:', error);
    res.status(500).json({ error: 'Failed to fetch swap' });
  }
});

//update
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { originalFood, healthyAlternative, description } = req.body;

  try {
    const existingSwap = await prisma.cravingSwaps.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSwap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (existingSwap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedSwap = await prisma.cravingSwaps.update({
      where: { id: parseInt(id) },
      data: {
        originalFood,
        healthyAlternative,
        description
      }
    });

    res.json({
      success: true,
      message: 'Swap updated successfully',
      swap: updatedSwap
    });
  } catch (error) {
    console.error('Error updating swap:', error);
    res.status(500).json({ error: 'Failed to update swap' });
  }
});

//delete
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const swap = await prisma.cravingSwaps.findUnique({
      where: { id: parseInt(id) }
    });

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.cravingSwaps.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Swap deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting swap:', error);
    res.status(500).json({ error: 'Failed to delete swap' });
  }
});

module.exports = router;