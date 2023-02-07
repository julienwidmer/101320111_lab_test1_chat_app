/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const express = require("express");
const routes = express.Router();
const UserModel = require("../models/userModel");
const session = require("express-session");

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
        await newUser.save();
        //res.status(201).send(newUser);
        // TODO: save newUser info somewhere
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
                    const successMessage = {
                        "status": true,
                        "username": login.username,
                        "message": "User logged in successfully"
                    };

                    //res.status(200).send(successMessage);
                    // TODO: save user info somewhere

                    req.session.data = { username: login.username };

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