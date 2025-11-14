const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const swapDatabase = {
    pizza: ['Cauliflower crust pizza', 'Veggie-loaded pizza', 'Whole-grain pita pizza'],
    chocolate: ['Dark chocolate (70%+ cocoa)', 'Chocolate protein shake', 'Cocoa energy bites'],
    chips: ['Baked veggie chips', 'Air-popped popcorn', 'Roasted chickpeas'],
    soda: ['Sparkling water with fruit', 'Kombucha', 'Iced green tea'],
    icecream: ['Greek yogurt with berries', 'Banana nice cream', 'Frozen yogurt bar'],
    burger: ['Grilled chicken burger', 'Black bean burger', 'Turkey burger'],
    fries: ['Baked sweet potato fries', 'Zucchini fries', 'Carrot sticks with hummus'],
    candy: ['Dried fruit', 'Trail mix with nuts', 'Yogurt-covered raisins'],
    cookies: ['Oatmeal cookies', 'Protein cookies', 'Rice cakes with almond butter'],
    cake: ['Banana bread', 'Greek yogurt parfait', 'Mini protein muffins'],
    pasta: ['Zucchini noodles', 'Chickpea pasta', 'Whole-wheat pasta'],
    donut: ['Baked donut', 'Whole-grain muffin', 'Apple slices with peanut butter'],
    coffee: ['Iced latte with almond milk', 'Matcha latte', 'Black coffee with cinnamon'],
    beer: ['Low-calorie beer', 'Sparkling water with lime', 'Kombucha mocktail'],
    wine: ['Red wine (small pour)', 'Sparkling water with berries', 'Grape juice spritzer'],
  };
  
const prisma = new PrismaClient();
//middleware jwt
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Token missing.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

router.post('/suggestions', authenticateToken, async (req, res) => {
  const { craving } = req.body;
  if (!craving) return res.status(400).json({ error: 'Craving is required.' });

  try {
    const cravingKey = craving.toLowerCase().replace(/\s+/g, '');
    const suggestions = swapDatabase[cravingKey];

    if (suggestions) {
      return res.json({
        craving,
        suggestions: suggestions.slice(0, 3),
      });
    } else {
      const funFallbacks = [
        "Let's get creative! Try making a fun healthy twist on your craving.",
        "Explore new flavors — mix something crunchy, creamy, or fruity!",
        "Satisfy your craving with something fresh, colorful, and delicious.",
      ];

      return res.json({
        craving,
        suggestions: funFallbacks,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get swap suggestions.' });
  }
});

router.post('/accept', authenticateToken, async (req, res) => {
  const { originalCraving, suggestedSwap, cravingType } = req.body;
  if (!originalCraving || !suggestedSwap) {
    return res.status(400).json({ error: 'originalCraving and suggestedSwap are required.' });
  }
  try {
    const swap = await prisma.cravingSwaps.create({
      data: {
        userId: req.user.userId,
        originalItem: originalCraving,
        suggestedSwap,
        accepted: true,
        cravingType: cravingType || 'General', 
      },
    });

    res.json({ message: 'Swap accepted successfully.', swap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save swap.' });
  }
});

  
// swap satisfaction rating
router.put('/:id/rate', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
  
    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
  
    try {
      const updatedSwap = await prisma.cravingSwaps.update({
        where: { id: parseInt(id) },
        data: {
          satisfactionRating: rating,
          completedAt: new Date(),
        },
      });
  
      res.json({ message: 'Swap rated successfully.', updatedSwap });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to rate swap.' });
    }
  });
  

//history
// GET /history - Fetch user's past swaps
router.get('/history', authenticateToken, async (req, res) => {
    try {
      const history = await prisma.cravingSwaps.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
      });
  
      res.json(history);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch swap history.' });
    }
  });

module.exports = router;
