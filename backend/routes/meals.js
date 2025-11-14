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
        const meals = await prisma.meal.findMany({
            where: { userId: req.user.userId },
            orderBy: { timestamp: 'desc' }
        });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

//get a single meal
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const meal = await prisma.meal.findFirst({
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
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { mealType, foods, photo, moodBefore, moodAfter, cravings, notes, timestamp } = req.body;

        // if (!mealType || typeof mealType !== 'string') {
        //     return res.status(400).json({ error: 'mealType is required and must be a string' });
        // }

        // if (!foods || (!Array.isArray(foods) && typeof foods !== 'string')) {
        //     return res.status(400).json({ error: 'foods must be a string or an array' });
        // }

        const meal = await prisma.meal.create({
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
        res.status(400).json({ error: 'Failed to create meal' });
    }
});


//update meal
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { mealType, foods, photo, moodBefore, moodAfter, cravings, notes } = req.body;
        
        const meal = await prisma.meal.update({
            where: {
                id_userId: { 
                  id: parseInt(req.params.id),
                  userId: req.user.userId
                }},
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
        const meal = await prisma.meal.delete({
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