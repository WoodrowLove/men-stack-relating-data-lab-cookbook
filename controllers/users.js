const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Index - Show all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index', { users });
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.send('Error retrieving users');
    }
});

// Show - Show a specific user's pantry
router.get('/:userId/foods', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.render('users/show', { pantry: user.pantry, user });
    } catch (err) {
        console.error('Error retrieving user pantry:', err);
        res.send('Error retrieving user pantry');
    }
});

module.exports = router;
