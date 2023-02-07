/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
// Modules
require('dotenv').config();
const mongoose = require("mongoose");

const express = require('express');
const session = require("express-session");
const socket = require("socket.io");


// Database connection
const DB_NAME = "COMP3133-LAB-TEST-1";
const DB_USER = "admin";
const DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.yw8mq9e.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if (error) throw error;
    console.log("Successfully connected to MongoDB");
});


// Server config
const app = express();
const SERVER_PORT = 8080;
const server = app.listen(SERVER_PORT, () => {
    console.log(`Server listening at: http://localhost:${SERVER_PORT}`);
});


// Middleware
// See documentation: https://expressjs.com/en/resources/middleware/session.html
const sessionMiddleware = session({
    secret: process.env.SESSION_MIDDLEWARE_SECRET,
    resave: false, // forces the session to be saved back to the session store --> false because touch method not used
    saveUninitialized: false, // false -> useful for login sessions, reducing server storage usage (from doc)
    cookie: { maxAge: 3_600_000 } // maximum age in milliseconds (3,600,000 = 1h)
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Socket.io
const io = socket(server);
app.use((req, res, next) => {
    try {
        // Active session --> save username
        currentUsername = req.session.data.username;
    } catch {
        // Inactive session --> Username is undefined
        console.log("User is NOT signed in.");
        //console.log(req.session);
    }

    next();
});

let currentUsername = "unknown";
let clients = 0;
io.on("connection", (clientSocket) => {
    console.log(`Client connected: ${clientSocket.id}`);

    // Send username to client socket
    clientSocket.emit("username", currentUsername);

    clients += 1;
    clientSocket.on("disconnect", () => {
        clients -= 1;
        console.log(`Client disconnected: ${clientSocket.id}`);
    })

    console.log(`Number of client(s): ${clients}`);
})


// Routing config
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/message", messageRoutes);