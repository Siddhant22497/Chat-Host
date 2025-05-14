const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const user_info = require('./user_info');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Route to check if a username already exists
router.post('/signup', async (req, resp) => {
    try {
        const result = await user_info.find({ username: req.body.username });
        if (result.length > 0) {
            return resp.status(409).send({ error: 'Username already exists' }); // 409 Conflict
        }
        resp.status(200).send({ message: 'Username is available' });
    } catch (error) {
        console.error('Error during username check:', error);
        resp.status(500).send({ error: 'Failed to check username' });
    }
});

// Route to create a new user
router.post('/signupnow', async (req, resp) => {
    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the salt rounds
        const newUser = await user_info.create({
            username: req.body.username,
            password: hashedPassword, // Save the hashed password
        });

        resp.status(201).send({ message: 'User created successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        resp.status(500).send({ error: 'Failed to create user.' });
    }
});

module.exports = router;