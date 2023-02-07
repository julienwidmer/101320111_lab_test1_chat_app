/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const mongoose = require("mongoose");
const passwordValidator = require("password-validator");
const bcrypt = require("bcrypt");
const {getTimestamp} = require("../timestamp");

// Password validation schema
const validatePassword = new passwordValidator();
validatePassword
    .has().symbols(3)
    .has().digits(1)
    .has().not().spaces()
    .is().min(8)

// Define schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: String,
    lastname: String,
    password: {
        type: String,
        required: true,
        maxLength: 50,
        validate: {
            validator: (password) => validatePassword.validate(password),
            message: (props) => {
                let message = `'${props.value}' is not meeting the requirements! `;
                message += "At least 3 symbols, 1 digit, no spaces and at least 8 characters.";
                return message;
            }
        }
    },
    created_on: String
})

/* User JSON example:
{
"username": "yoddler201",
"firstname": "John",
"lastname": "Doe",
"password": "!@#12345"
}

{
"username": "guest007",
"firstname": "Jane",
"lastname": "Doe",
"password": "p9q#4$!o"
}

Once created, a value will be set for
"created_on" formatted as
DD-MM-YYYY HH:MM AM/PM
*/

UserSchema.pre("save", function (next) {
    // Set timestamp if first save
    if (this.isNew) { this.created_on = getTimestamp() }

    // Hash password before saving (hash) into database if modified or first save
    if (this.isModified("password") || this.isNew) {
        // Generate password salt
        bcrypt.genSalt(10, (error, salt) => {
            if (error) {
                return next(error);
            } else {
                // Hash password
                bcrypt.hash(this.password, salt, (error, hash) => {
                    if (error) { return error; }

                    // Save hash
                    this.password = hash
                    return next();
                });
            }
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (plainTextPassword, callback) {
    bcrypt.compare(plainTextPassword, this.password, (error, isMatch) => {
        if (error) {
            return callback(error);
        } else {
            callback(null, isMatch);
        }
    })
}

// Create mongodb schema
const user = mongoose.model("user", UserSchema);
module.exports = user;
