const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken } = require('../middleware/authMid');


const prisma = new PrismaClient();
const router = express.Router();
const { generateDiscoverMeals } = require('../services/aiService');

router.get("/meals", authenticateToken, async (req, res) => {
  try {
    const allMeals = await prisma.curatedMeal.findMany({
      where: { category: "healthy" }
    });
    
    // Shuffle the array to make it feel a bit dynamic, then return the first 4
    const shuffled = allMeals.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);

    // Map the database fields to match what the frontend expects
    const formatted = selected.map(meal => ({
      id: meal.id,
      name: meal.name,
      time: meal.time || "15 min",
      tags: meal.tags ? meal.tags : ["Healthy"],
      image: meal.imageUrl
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching feed meals:", err);
    res.status(500).json({ error: "Failed to generate meals" });
  }
});

router.get("/meals/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const meals = await prisma.meal.findMany({
      where: { category: category.toLowerCase() }
    });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals by category" });
  }
});

module.exports = router;
