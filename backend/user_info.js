const mongoose=require('mongoose');


const user_info_schema=new mongoose.Schema({
    username:String,
    password:String
},{ collection: 'user_info' });
module.exports=mongoose.model('user_info',user_info_schema);