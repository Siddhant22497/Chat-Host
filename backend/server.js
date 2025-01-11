const db = require('./db');
const mongoose=require('mongoose');
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const user_info=require('./user_info');
const path=require('path');

const _dirname=path.resolve();


const tologin = require('./login.js');
const tosignup = require('./signup');

const tofetchindichat = require('./tofetchindichat');
const tofetchgroup = require('./tofetchgroup');
const togetresult = require('./togetresult');


mongoose.connect('mongodb://localhost:27017/chat_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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
        origin: "https://chat-host.onrender.com",
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



app.use(express.static(path.join(_dirname,"/frontend/build")));
app.get("*",(req,resp)=>{
    resp.sendFile(path.resolve(_dirname,"frontend","build","index.html"));
});


const PORT = 5200;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
