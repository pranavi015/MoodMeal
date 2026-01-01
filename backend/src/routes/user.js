const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authenticateToken } = require('../middleware/authMid');

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, avatar },
      select: { id: true, email: true, name: true, avatar: true }
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/preferences', authenticateToken, async (req, res) => {
  const { reminders, theme } = req.body; 
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        preferences: { 
          set: { reminders, theme }
        }
      }
    });
    res.json({ message: 'Preferences updated', updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/account', authenticateToken, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.user.id }
    });
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
