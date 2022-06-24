const express = require('express');
const chats = require('./data/data');
const connect_database = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cloudinary = require('cloudinary');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");


const app = express();

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({path: "backend/config/config.env"});
}


// routes and controllers inside server.js.. will be modified
connect_database();
// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// using extra middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}));


// app.get('/', (req, res) => {
//     res.send("API is running properly");
// });

app.use('/api/user/', userRoutes);
app.use('/api/chat/', chatRoutes);
app.use('/api/message/', messageRoutes);

// deployment starts
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// deployment ends



const server = app.listen(process.env.PORT, () => {
  console.log( `the server has started at ${process.env.PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("user joined room: " + room);
    });

    // socket typing
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.chat;
      if(!chat.users){
        console.log("chat.user is not defined");
      }
      chat.users.forEach((user) => {
        if(user._id === newMessageReceived.sender._id){
          return;
        }
        console.log(newMessageReceived.content);
        socket.in(user._id).emit("message received", newMessageReceived);
      });
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
});
