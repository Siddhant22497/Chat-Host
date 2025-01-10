const mongoose=require('mongoose');
const express=require('express');
const router=express.Router();
const user_info=require('./user_info');



router.post('/',async (req,resp)=>{
    let result=await user_info.find({username:req.body.username,password:req.body.password});
    let l=result.length;
    resp.send(result);
})


module.exports=router;
