/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const mongoose = require("mongoose");
const {getTimestamp} = require("../timestamp");

// Define schema
const PMSchema = new mongoose.Schema({
    from_user: String,
    to_user: String,
    message: String,
    date_sent: String
})

/* User JSON example:
{
"from_user": "yoddler201",
"to_user": "guest007",
"message": "Hey, How are you?!"
}

Once created, a value will be set for
"date_sent" formatted as
DD-MM-YYYY HH:MM AM/PM
*/

PMSchema.pre("save", function (next) {
    // Set timestamp if first save
    if (this.isNew) {
        // Save timestamp
        this.created_on = getTimestamp();
        return next();
    }
});

// Create mongodb schema
const private_message = mongoose.model("private_message", PMSchema);
module.exports = private_message;