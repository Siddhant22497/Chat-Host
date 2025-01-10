const mongoose = require('mongoose');
const user_info = require('./user_info');



const groupmodel = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.String,
        ref: 'user_info'
    },
    groupname: {
        type: mongoose.Schema.Types.String,
    },
    groupmember: [
        {
            type: mongoose.Schema.Types.String,
            ref: 'user_info'
        }],
    currentDate: {
        type: mongoose.Schema.Types.String
    },
    currentTime: {
        type: mongoose.Schema.Types.String,

    }
}, {
    timestamps: true,
})

const groupchat = mongoose.model('groupchat', groupmodel);

module.exports = groupchat;

