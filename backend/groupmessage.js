const mongoose = require('mongoose');

const groupmessagemodel = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.String,
        ref: 'user_info'
    },
    groupname: {
        type: mongoose.Schema.Types.String,
    },
    chat: {
        type: mongoose.Schema.Types.String,
    },
    currentDate: {
        type: mongoose.Schema.Types.String
    },
    currentTime: {
        type: mongoose.Schema.Types.String,

    }
}, {
    timestamps: true
})

const groupmessage = mongoose.model('groupmessage', groupmessagemodel);

module.exports = groupmessage;