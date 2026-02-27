const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/authMid');

const router = express.Router();
const prisma = new PrismaClient();

/* ==============================
   GET ALL MEALS (with filters)
============================== */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'timestamp',
      sortOrder = 'desc',
      filterMealType,
      filterMood
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    const skip = (pageNumber - 1) * pageSize;

    const where = {
      userId: req.user.userId,
      AND: []
    };

    if (search) {
      where.AND.push({
        foods: {
          contains: search,
          mode: "insensitive"
        }
      });
    }

    if (filterMealType) {
      where.AND.push({ mealType: filterMealType });
    }

    if (filterMood) {
      where.AND.push({ moodAfter: filterMood });
    }

    const validSortFields = ['timestamp', 'mealType'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'timestamp';

    const validSortOrder = ['asc', 'desc'];
    const order = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';

    const [meals, total] = await Promise.all([
      prisma.userMeal.findMany({
        where,
        orderBy: { [sortField]: order },
        skip,
        take: pageSize
      }),
      prisma.userMeal.count({ where })
    ]);

    res.json({
      meals,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });

  } catch (error) {
    console.error("GET MEALS ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

/* ==============================
   GET SINGLE MEAL
============================== */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);
    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const meal = await prisma.userMeal.findFirst({
      where: {
        id: mealId,
        userId: req.user.userId
      }
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json(meal);

  } catch (error) {
    console.error("GET SINGLE MEAL ERROR:", error);
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

/* ==============================
   CREATE MEAL
============================== */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      mealType,
      foods,
      photo,
      moodBefore,
      moodAfter,
      cravings,
      notes,
      timestamp
    } = req.body;

    if (!mealType || !foods) {
      return res.status(400).json({
        error: "mealType and foods are required"
      });
    }

    const meal = await prisma.userMeal.create({
      data: {
        userId: req.user.userId,
        mealType,
        foods,
        photo: photo || null,
        moodBefore: moodBefore || null,
        moodAfter: moodAfter || null,
        cravings: cravings || null,
        notes: notes || null,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      }
    });

    res.status(201).json(meal);

  } catch (error) {
    console.error("CREATE MEAL ERROR:", error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

/* ==============================
   UPDATE MEAL
============================== */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);

    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const existingMeal = await prisma.userMeal.findFirst({
      where: {
        id: mealId,
        userId: req.user.userId
      }
    });

    if (!existingMeal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const {
      mealType,
      foods,
      photo,
      moodBefore,
      moodAfter,
      cravings,
      notes
    } = req.body;

    const updateData = {};

    if (mealType !== undefined) updateData.mealType = mealType;
    if (foods !== undefined) updateData.foods = foods;
    if (photo !== undefined) updateData.photo = photo || null;
    if (moodBefore !== undefined) updateData.moodBefore = moodBefore || null;
    if (moodAfter !== undefined) updateData.moodAfter = moodAfter || null;
    if (cravings !== undefined) updateData.cravings = cravings || null;
    if (notes !== undefined) updateData.notes = notes || null;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updatedMeal = await prisma.userMeal.update({
      where: { id: mealId },
      data: updateData
    });

    res.json(updatedMeal);

  } catch (error) {
    console.error("UPDATE ERROR FULL:", error);
    res.status(500).json({
      error: error.message || "Failed to update meal"
    });
  }
});

/* ==============================
   DELETE MEAL
============================== */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const mealId = parseInt(req.params.id);

    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    const result = await prisma.userMeal.deleteMany({
      where: {
        id: mealId,
        userId: req.user.userId
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.json({ message: "Meal deleted successfully" });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

module.exports = router;