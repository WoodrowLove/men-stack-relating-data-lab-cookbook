const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Index - Show all foods in a user's pantry
router.get('/', async (req, res) => {
    try {
        console.log('Session User ID:', req.session.user._id); // Log the session user ID
        const user = await User.findById(req.session.user._id);
        console.log('User:', user); // Log the user object
        if (!user) {
            throw new Error('User not found');
        }
        res.render('foods/index', { pantry: user.pantry });
    } catch (err) {
        console.error('Error retrieving pantry items:', err);
        res.send('Error retrieving pantry items');
    }
});

// New - Show form to create a new food item
router.get('/new', (req, res) => {
    res.render('foods/new', { userId: req.session.user._id });
});

// Create - Add new food item to pantry
router.post('/', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.pantry.push({ name: req.body.name });
        await user.save();
        res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (err) {
        res.send('Error adding item to pantry');
    }
});

// Edit - Show form to edit a specific food item
router.get('/:itemId/edit', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const item = user.pantry.id(req.params.itemId);
        res.render('foods/edit', { item, userId: req.session.user._id });
    } catch (err) {
        res.send('Error retrieving food item for edit');
    }
});

// Update - Update a specific food item in pantry
router.put('/:itemId', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        const item = user.pantry.id(req.params.itemId);
        item.name = req.body.name;
        await user.save();
        res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (err) {
        res.send('Error updating food item');
    }
});

// Delete - Remove a specific food item from pantry
router.delete('/:itemId', async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        user.pantry.id(req.params.itemId).remove();
        await user.save();
        res.redirect(`/users/${req.session.user._id}/foods`);
    } catch (err) {
        res.send('Error deleting food item');
    }
});

module.exports = router;

