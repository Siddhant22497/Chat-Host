const db = require('./db');
const mongoose = require('mongoose');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require('path');
const dotenv=require('dotenv')


if(process.env.NODE_ENV!=="production")
{
    dotenv.config({
        path:'./env'
    })
}

db();

const groupchat = require('./groupchat');
const groupmessage = require('./groupmessage');
const user_info = require('./user_info');
const individualmessage = require('./individualmessage');



const _dirname = path.resolve();


const tologin = require('./login.js');
const tosignup = require('./signup.js');

const tofetchindichat = require('./tofetchindichat.js');
const tofetchgroup = require('./tofetchgroup.js');
const togetresult = require('./togetresult.js');

const PORT = process.env.PORT;





const app = express();

app.use(cors());
app.use(express.json());

app.use('/tologin', tologin);

app.use('/tosignup', tosignup);

app.use('/tofetchgroup', tofetchgroup);

app.use('/tofetchindichat', tofetchindichat);


app.use('/togetresult', togetresult);


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [`http://localhost:${process.env.FRONT_END_PORT}`],
        methods: ["GET", "POST"],
    },
    pingTimeout: 120000,
});

io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
        socket.to(data.identifier1).emit("receive_message", data);
        socket.to(data.identifier2).emit("receive_message", data);
    });

    socket.on("join_room", (data) => {
        socket.join(data);
    })

    socket.on("join_room_group", (data) => {
        socket.join(data);
    })
    socket.on("send_message_group", (data) => {
        socket.to(data.groupname).emit("receive_group_message", data);
    });
});





server.listen(PORT);
