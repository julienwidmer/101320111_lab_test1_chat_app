/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const express = require("express");
const routes = express.Router();
const UserModel = require("../models/userModel");

// http://localhost:8081/user/signup
routes.post("/signup", async (req, res) => {
    // Validate request
    if(JSON.stringify(req.body) == "{}") {
        // Client side error
        return res.status(400).send({message: "Form can not be empty"});
    }

    // Create new User
    const newUser = new UserModel(req.body);
    try {
        // Save new user
        await newUser.save();
        // Redirect to chat rooms
        res.redirect("/rooms");
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

// http://localhost:8081/user/signin
routes.post("/signin", (req, res) => {
    // Validate request
    if(JSON.stringify(req.body) == "{}") {
        // Client side error
        return res.status(400).send({message: "Sign in content can not be empty"});
    }

    // Authenticate user
    const login = req.body;
    UserModel.findOne({"username": login.username}, (error, user) => {
        if (error) {
            // Server side error
            res.status(500).send({message: `Error while authenticating user: ${error}`});
        }

        const wrongCredentialsMessage = {
            "status": false,
            "message": "Invalid username and password."
        };

        if (user == null) {
            // Client side error - wrong username
            res.status(400).send(wrongCredentialsMessage);
        } else {
            user.comparePassword(login.password, (error, isMatch) => {
                if (error) {
                    // Server side error
                    res.status(500).send({message: `Error while authenticating user: ${error}`});
                }

                if (isMatch) {
                    // Set session as active
                    req.session.data = {
                        authenticated: true,
                        username: login.username
                    };

                    // Redirect to chat rooms
                    res.redirect("/rooms");
                } else {
                    // Client side error - wrong password
                    res.status(400).send(wrongCredentialsMessage);
                }
            })
        }
    });
})

module.exports = routes;