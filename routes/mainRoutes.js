/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const express = require("express");
const routes = express.Router();

function isUserSessionActive(session) {
    try {
        return session.data.authenticated; // Session becomes active (true) when sign in is successful
    } catch {
        // Session never started --> set to false (default)
        session.data = { authenticated: false };
        return false;
    }
}


// Sign Up
// http://localhost:8081/signup
routes.get("/signup", async (req, res) => {
    if (isUserSessionActive(req.session)) {
        // User session active -> redirect to chat rooms
        res.redirect("/rooms");
    } else {
        // Display sign up page
        res.sendFile("public/signup.html", { root : `${__dirname}/../`});
    }
})


// Sign In and Rooms
// http://localhost:8081/signin
// http://localhost:8081/rooms
routes.get("/signin", async (req, res) => {
    if (isUserSessionActive(req.session)) {
        // User session active -> redirect to chat rooms
        res.redirect("/rooms");
    } else {
        // Display sign in page
        res.sendFile("public/signin.html", { root : `${__dirname}/../`});
    }
})


// Rooms
// http://localhost:8081/rooms
routes.get("/rooms", async (req, res) => {
    if (isUserSessionActive(req.session)) {
        // User session active -> redirect to chat rooms

        // TODO: Connect session with socket
        console.log(req.session.data.username);

        // Display rooms page
        res.sendFile("public/rooms.html", { root : `${__dirname}/../`});
    } else {
        // Redirect to sign in page
        res.redirect("/signin");
    }
})


// Sign Out
// http://localhost:8081/signout
routes.get("/signout", async (req, res) => {
    // Sign out user by destroying session
    req.session.destroy();
    // Redirect user to sign in page
    res.redirect("/signin");
})


// Main
// http://localhost:8081/
routes.get(["*", "/"], async (req, res) => {
    if (isUserSessionActive(req.session)) {
        // User session active -> redirect to chat rooms
        res.redirect("/rooms");
    } else {
        // Redirect to sign up page
        res.redirect("/signup");
    }
})


module.exports = routes;