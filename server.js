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
//const uuid = require("uuid").v5; // needed to generate unique session id

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
const SERVER_PORT = 8080;
const app = express();

// See documentation: https://expressjs.com/en/resources/middleware/session.html
const sessionMiddleware = session({
    //genid: function(req) { return uuid(); }, // use UUIDs for session IDs to avoid conflicts between sessions
    secret: process.env.SESSION_MIDDLEWARE_SECRET,
    resave: false, // forces the session to be saved back to the session store --> false because touch method not used
    saveUninitialized: false, // false -> useful for login sessions, reducing server storage usage (from doc)
    cookie: { maxAge: 3_600_000 } // maximum age in milliseconds (3,600,000 = 1h)
});

app.use(sessionMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing config
const mainRoutes = require("./routes/mainRoutes");
app.use("/", mainRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/message", messageRoutes);

app.listen(SERVER_PORT, () => {
    console.log(`Server listening at: http://localhost:${SERVER_PORT}`);
});