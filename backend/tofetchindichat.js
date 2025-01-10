const express = require("express");
const router= express.Router();
const individualmessage = require("./individualmessage");





router.post("/tofetchindichat", async (req, resp) => {
  const receiver = req.body.receiver;
  const sender = req.body.sender;
  const result = await individualmessage.find({ "receiver": receiver, "sender": sender });
  resp.send(result);
})


router.delete("/deleteindichat", async (req, resp) => {
  const receiver = req.body.receiver;
  const sender = req.body.sender;
  const res = await individualmessage.deleteMany({ "receiver": receiver, "sender": sender });
  resp.send(res);
})

router.post("/intialindires", async (req, resp) => {
  const receiver = req.body.receiver;
  const messages = await individualmessage.aggregate([
    { $match: { receiver } },
    {
      $sort: { createdAt: -1 } 
    },
    {
      $group: {
        _id: "$sender", 
        latestMessage: { $first: "$chat" }, 
        currentDate: { $first: "$currentDate" }, 
        currentTime: { $first: "$currentTime" }, 
        createdAt: { $first: "$createdAt" },
      }
    },
    {
      $project: {
        _id: 0, 
        sender: "$_id", 
        latestMessage: 1,
        currentDate: 1,
        currentTime: 1,
        createdAt: 1
      }
    }
  ]);
  resp.status(200).send(messages);
})

router.post("/saveindichat", async (req, resp) => {
  const receiver = req.body.receiver
  const sender = req.body.sender
  const whichuser = req.body.whichuser
  const textToSend = req.body.textToSend
  const currentTime = req.body.currentTime
  const currentDate = req.body.currentDate
  const res = await individualmessage.create({
    "receiver": receiver,
    "sender": sender,
    "whichuser": whichuser,
    "chat": textToSend,
    "currentDate": currentDate,
    "currentTime": currentTime
  })
  resp.send(res);

})

module.exports = router;