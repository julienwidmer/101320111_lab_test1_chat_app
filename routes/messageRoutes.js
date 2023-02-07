/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const express = require("express");
const routes = express.Router();
const UserModel = require("../models/userModel");

// http://localhost:8081/message/:to_user
routes.post("/message", async (req, res) => {
    // Validate request
    if(JSON.stringify(req.body) == "{}") {
        // Client side error
        return res.status(400).send({message: "Message content can not be empty"});
    }

    // Create new User
    const newMessage = new UserModel(req.body);
    try {
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        if (error.toString().includes("duplicate key error")) {
            // Client side error -> username must be unique
            return res.status(400).send({message: "Username is already in use."});
        } else {
            // Server side error
            return res.status(500).send({message: `User not created: ${error}`});
        }
    }
})

module.exports = routes;