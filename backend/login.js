const express = require('express');
const router = express.Router();
const user_info = require('./user_info');
const bcrypt = require('bcrypt'); // Import bcrypt for password comparison

// Login route
router.post('/', async (req, resp) => {
    try {
        // Find the user by username
        const user = await user_info.findOne({ username: req.body.username });
        if (!user) {
            return resp.status(404).send({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return resp.status(401).send({ error: 'Invalid password' });
        }

        // If login is successful
        resp.status(200).send({ message: 'Login successful', username: user.username });
    } catch (error) {
        console.error('Error during login:', error);
        resp.status(500).send({ error: 'Failed to log in' });
    }
});

module.exports = router;