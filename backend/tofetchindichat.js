const express = require("express");
const router = express.Router();
const individualmessage = require("./individualmessage");
const { encrypt, decrypt } = require("./cryptography.js"); 

// Route to fetch individual chat messages
router.post("/tofetchindichat", async (req, resp) => {
  const receiver = req.body.receiver;
  const sender = req.body.sender;

  // Fetch messages from the database
  const result = await individualmessage.find({ receiver, sender });

  // Decrypt messages before sending
  const decryptedMessages = result.map((message) => ({
    ...message.toObject(),
    chat: decrypt(message.chat), // Decrypt the chat field
  }));

  resp.send(decryptedMessages);
});

// Route to delete individual chat messages
router.delete("/deleteindichat", async (req, resp) => {
  const receiver = req.body.receiver;
  const sender = req.body.sender;

  // Delete messages from the database
  const res = await individualmessage.deleteMany({ receiver, sender });
  resp.send(res);
});

// Route to fetch initial individual chat messages
router.post("/intialindires", async (req, resp) => {
  const receiver = req.body.receiver;

  // Aggregate messages to get the latest message for each sender
  const messages = await individualmessage.aggregate([
    { $match: { receiver } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$sender",
        latestMessage: { $first: "$chat" },
        currentDate: { $first: "$currentDate" },
        currentTime: { $first: "$currentTime" },
        createdAt: { $first: "$createdAt" },
      },
    },
    {
      $project: {
        _id: 0,
        sender: "$_id",
        latestMessage: 1,
        currentDate: 1,
        currentTime: 1,
        createdAt: 1,
      },
    },
  ]);

  // Decrypt the latest messages before sending
  const decryptedMessages = messages.map((message) => ({
    ...message,
    latestMessage: decrypt(message.latestMessage), // Decrypt the latestMessage field
  }));

  resp.status(200).send(decryptedMessages);
});

// Route to save individual chat messages
router.post("/saveindichat", async (req, resp) => {
  const { receiver, sender, whichuser, textToSend, currentTime, currentDate } = req.body;

  // Encrypt the message before saving
  const encryptedChat = encrypt(textToSend);

  // Save the encrypted message to the database
  const res = await individualmessage.create({
    receiver,
    sender,
    whichuser,
    chat: encryptedChat,
    currentDate,
    currentTime,
  });

  resp.send(res);
});

module.exports = router;