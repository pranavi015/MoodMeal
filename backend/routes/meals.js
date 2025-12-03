const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    try {
        // Extract query params with defaults
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
        const take = pageSize;

        // Build WHERE clause
        const where = {
            userId: req.user.userId,
            AND: []
        };

        // Search text in foods field
        if (search) {
            where.AND.push({
              foods: { has: search }
            });
          }
          
          

        // Filter by meal type
        if (filterMealType) {
            where.AND.push({
                mealType: filterMealType
            });
        }

        // Filter by moodAfter
        if (filterMood) {
            where.AND.push({
                moodAfter: filterMood
            });
        }

        // Sorting options
        const validSortFields = ['timestamp', 'mealType'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'timestamp';

        const validSortOrder = ['asc', 'desc'];
        const order = validSortOrder.includes(sortOrder) ? sortOrder : 'desc';

        // Query meals
        const [meals, total] = await Promise.all([
            prisma.userMeal.findMany({
                where,
                orderBy: {
                    [sortField]: order
                },
                skip,
                take
            }),
            prisma.userMeal.count({ where })
        ]);

        const totalPages = Math.ceil(total / pageSize);

        res.json({
            meals,
            pagination: {
                total,
                page: pageNumber,
                limit: pageSize,
                totalPages
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

//get a single meal
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const meal = await prisma.userMeal.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.userId
            }
        });

        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch meal' });
    }
});

//create new meal
// router.post('/', authenticateToken, async (req, res) => {
//     try {
//         const { mealType, foods, photo, moodBefore, moodAfter, cravings, notes, timestamp } = req.body;

//         // if (!mealType || typeof mealType !== 'string') {
//         //     return res.status(400).json({ error: 'mealType is required and must be a string' });
//         // }

//         // if (!foods || (!Array.isArray(foods) && typeof foods !== 'string')) {
//         //     return res.status(400).json({ error: 'foods must be a string or an array' });
//         // }

//         const meal = await prisma.userMeal.create({
//             data: {
//                 userId: req.user.userId,
//                 mealType,
//                 foods,
//                 photo,
//                 moodBefore,
//                 moodAfter,
//                 cravings,
//                 notes,
//                 timestamp: timestamp ? new Date(timestamp) : new Date()
//             }
//         });

//         res.status(201).json(meal);
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to create meal' });
//     }
// });
router.post('/', authenticateToken, async (req, res) => {
    console.log("Received payload:", req.body);
    try {
        const { mealType, foods, photo, moodBefore, moodAfter, cravings, notes, timestamp } = req.body;

        const meal = await prisma.userMeal.create({
            data: {
                userId: req.user.userId,
                mealType,
                foods,
                photo,
                moodBefore,
                moodAfter,
                cravings,
                notes,
                timestamp: timestamp ? new Date(timestamp) : new Date()
            }
        });

        res.status(201).json(meal);
    } catch (error) {
        console.error("Prisma create error:", error);
        res.status(400).json({ error: 'Failed to create meal' });
    }
});


//update meal
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { mealType, foods, photo, moodBefore, moodAfter, cravings, notes } = req.body;

        const meal = await prisma.userMeal.update({
            where: {
                id_userId: {
                    id: parseInt(req.params.id),
                    userId: req.user.userId
                }
            },
            data: {
                mealType,
                foods,
                photo,
                moodBefore,
                moodAfter,
                cravings,
                notes
            }
        });

        // if (meal.count === 0) {
        //     return res.status(404).json({ error: 'Meal not found' });
        // }

        res.json({ message: 'Meal updated', meal });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update meal' });
    }
});

//delete meal
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const meal = await prisma.userMeal.delete({
            where: {
                id_userId: parseInt(req.params.id),
                userId: req.user.userId
            }
        });

        // if (meal.count === 0) {
        //     return res.status(404).json({ error: 'Meal not found' });
        // }

        res.json({ message: 'Meal deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete meal' });
    }
});

module.exports = router;