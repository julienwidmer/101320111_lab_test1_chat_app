/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const mongoose = require("mongoose");
const {getTimestamp} = require("../timestamp");

// Define schema
const MessageSchema = new mongoose.Schema({
    from_user: String,
    room: String,
    message: String,
    date_sent: String
})

/* Message (public in a room) JSON example:
{
"from_user": "yoddler201",
"room": "covid19",
"message": "Hello World"
}

{
"from_user": "guest007",
"room": "covid19",
"message": "Hopefully things will get better."
}

Once created, a value will be set for
"date_sent" formatted as
DD-MM-YYYY HH:MM AM/PM
*/

MessageSchema.pre("save", function (next) {
    // Set timestamp if first save
    if (this.isNew) {
        // Save timestamp
        this.created_on = getTimestamp();
        return next();
    }
});

// Create mongodb schema
const message = mongoose.model("message", MessageSchema);
module.exports = message;