const mongoose = require('mongoose');
const user_info = require('./user_info');


const individualmessagemodel = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.String,
        ref: 'user_info'
    },
    receiver: {
        type: mongoose.Schema.Types.String,
        ref: 'user_info'
    },
    whichuser: {
        type: mongoose.Schema.Types.String,
        ref: 'user_info'
    },
    chat: {
        type: mongoose.Schema.Types.String,
        default: ""
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

const individualmessage = mongoose.model('individualmessage', individualmessagemodel);

module.exports = individualmessage;