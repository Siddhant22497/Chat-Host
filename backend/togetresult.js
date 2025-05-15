const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const user_info = require('./user_info.js');
const groupmessage = require('./groupmessage.js');
const { decrypt } = require('./cryptography.js'); // Import decrypt function

router.post('/tofetch', async (req, resp) => {
    const name = req.body.username;

    // Fetch matching users
    let result = await user_info.find({
        username: { $regex: name, $options: 'i' }
    });

    // Fetch matching group messages
    let result2 = await groupmessage.find({
        groupName: { $regex: name, $options: 'i' }
    });

    // Decrypt group messages before sending
    const decryptedGroupMessages = result2.map((message) => ({
        ...message.toObject(),
        chat: decrypt(message.chat) // Decrypt the chat field
    }));

    resp.send({
        users: result,
        groupMessages: decryptedGroupMessages
    });
});

module.exports = router;