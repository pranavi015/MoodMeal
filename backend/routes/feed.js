const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// 👉 GET all curated meals
router.get("/meals", async (req, res) => {
  try {
    const meals = await prisma.meal.findMany();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// 👉 GET meals by category
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
