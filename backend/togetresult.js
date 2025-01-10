const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const user_info=require('./user_info.js');
const groupmessage=require('./groupmessage.js');


router.post('/tofetch',async (req,resp)=>{
    const name=req.body.username;

    let result = await user_info.find({
        username: { $regex: name, $options: 'i' }
    });

    let result2 = await groupmessage.find({
        groupName: { $regex: name, $options: 'i' } 
    });

    resp.send({
        users: result,
        groupMessages: result2
    });
})

module.exports=router