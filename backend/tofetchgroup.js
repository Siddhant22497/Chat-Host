const express = require("express");
const router = express.Router();
const groupchat = require("./groupchat");
const groupmessage = require("./groupmessage");

router.post("/checkgroupexist", async (req, resp) => {
  const res = await groupchat.find({ groupname: req.body.groupname });
  resp.send({ flag: res.length > 0 ? "true" : "false" });
});

router.post("/getgroupmember", async (req, resp) => {
  const res = await groupchat.find({ groupname: req.body.groupname });
  resp.send(res);
});

router.post("/updategroupmember", async (req, resp) => {
  const res = await groupchat.updateOne({
    groupname: req.body.groupname,
    groupmember: req.body.groupmember,
  });
  resp.send(res);
});

router.post("/intialresultgroup", async (req, resp) => {
  const groups = await groupchat
    .find({ groupmember: req.body.receiver })
    .select("groupname groupmember currentDate currentTime");

  const result = groups.map(group => ({
    groupname: group.groupname,
    currentDate: group.currentDate,
    currentTime: group.currentTime,
    groupmember: group.groupmember,
  }));

  resp.status(200).send(result);
});

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

  resp.json(messages);
});

router.post("/loadgroupmessage", async (req, resp) => {
  const groups = await groupmessage
    .find({ groupname: req.body.groupname })
    .select(
      "receiver groupname groupmember chat currentDate currentTime"
    );

  const result = groups.map(group => ({
    receiver: group.receiver,
    groupname: group.groupname,
    chat: group.chat,
    currentDate: group.currentDate,
    currentTime: group.currentTime,
  }));

  resp.status(200).send(result);
});

router.post("/savegroupmessage", async (req, resp) => {
  const res = await groupmessage.create({
    receiver: req.body.receiver,
    groupname: req.body.groupname,
    groupmember: req.body.groupmember,
    chat: req.body.chat,
    currentDate: req.body.currentDate,
    currentTime: req.body.currentTime,
  });

  resp.send(res);
});

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
