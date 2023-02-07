/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
// Modules
require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing config
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

app.listen(SERVER_PORT, () => {
    console.log(`Server listening at: http://localhost:${SERVER_PORT}`);
});