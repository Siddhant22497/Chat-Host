const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const user_info=require('./user_info');


const app=express();




router.post('/signup',async (req,resp)=>{
    let result=await user_info.find({username:req.body.username});
    resp.send(result);
    
    
    
})

router.post('/signupnow',async (req,resp)=>{
    let result2=await user_info.create({username:req.body.username,password:req.body.password});
    const result=await result2.save();
})

module.exports=router;
