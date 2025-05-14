const express = require("express");
const router = express.Router();
const groupchat = require("./groupchat");
const groupmessage = require("./groupmessage");
const { encrypt, decrypt } = require("./cryptography"); // Import encrypt and decrypt functions

// Check if group exists
router.post("/checkgroupexist", async (req, resp) => {
  const res = await groupchat.find({ groupname: req.body.groupname });
  resp.send({ flag: res.length > 0 ? "true" : "false" });
});

// Get group members
router.post("/getgroupmember", async (req, resp) => {
  const res = await groupchat.find({ groupname: req.body.groupname });
  resp.send(res);
});

// Update group members
router.post("/updategroupmember", async (req, resp) => {
  const res = await groupchat.updateOne(
    { groupname: req.body.groupname },
    { $set: { groupmember: req.body.groupmember } }
  );
  resp.send(res);
});

// Fetch initial group information
router.post("/intialresultgroup", async (req, resp) => {
  const groups = await groupchat
    .find({ groupmember: req.body.receiver })
    .select("groupname groupmember currentDate currentTime");

  const result = groups.map((group) => ({
    groupname: group.groupname,
    currentDate: group.currentDate,
    currentTime: group.currentTime,
    groupmember: group.groupmember,
  }));

  resp.status(200).send(result);
});

// Fetch initial group messages
router.post("/intialgroupres", async (req, resp) => {
  const groupname = req.body.groupname;

  const messages = await groupmessage.aggregate([
    { $match: { groupname } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$groupname",
        latestMessage: { $first: "$chat" },
        receiver: { $first: "$receiver" },
        currentDate: { $first: "$currentDate" },
        currentTime: { $first: "$currentTime" },
      },
    },
    {
      $project: {
        _id: 0,
        groupname: "$_id",
        latestMessage: 1,
        receiver: 1,
        currentDate: 1,
        currentTime: 1,
      },
    },
  ]);

  // Decrypt the latest messages before sending
  const decryptedMessages = messages.map((message) => ({
    ...message,
    latestMessage: decrypt(message.latestMessage), // Decrypt the latestMessage field
  }));

  resp.json(decryptedMessages);
});

// Load group messages
router.post("/loadgroupmessage", async (req, resp) => {
  const groups = await groupmessage
    .find({ groupname: req.body.groupname })
    .select(
      "receiver groupname groupmember chat currentDate currentTime"
    );

  // Decrypt messages before sending
  const result = groups.map((group) => ({
    receiver: group.receiver,
    groupname: group.groupname,
    chat: decrypt(group.chat), // Decrypt the chat field
    currentDate: group.currentDate,
    currentTime: group.currentTime,
  }));

  resp.status(200).send(result);
});

// Save group message
router.post("/savegroupmessage", async (req, resp) => {
  // Encrypt the message before saving
  const encryptedChat = encrypt(req.body.chat);

  const res = await groupmessage.create({
    receiver: req.body.receiver,
    groupname: req.body.groupname,
    groupmember: req.body.groupmember,
    chat: encryptedChat, // Save encrypted chat
    currentDate: req.body.currentDate,
    currentTime: req.body.currentTime,
  });

  resp.send(res);
});

// Save group information
router.post("/savegroupinfo", async (req, resp) => {
  const res = await groupchat.create({
    receiver: req.body.receiver,
    groupname: req.body.groupname,
    groupmember: req.body.groupmember,
    currentDate: req.body.currentDate,
    currentTime: req.body.currentTime,
  });

  resp.send(res);
});

module.exports = router;