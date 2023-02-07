/*
Course Code:    COMP3133
Lab Test:       1
Student Name:   Julien Widmer
Student ID:     101320111
*/
const mongoose = require("mongoose");
const passwordValidator = require("password-validator");
const bcrypt = require("bcrypt");

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

Once created, a value will be set for
"created_on" formatted as
DD-MM-YYYY HH:MM AM/PM
*/

UserSchema.pre("save", function (next) {
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

        // Set timestamp if first save
        if (this.isNew) {
            // Get current date
            const date = new Date();
            // Format date to locale format (i.e. 02/06/2023, 10:17 p.m.)
            const formattedDate = date.toLocaleString('en-CA', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            // Format date as timestamp (i.e. 02/06/2023, 10:17 p.m. --> 02-06-2023 10:18 PM)
            const timestamp = formattedDate.replaceAll("/", "-") // replace day, month and year separators
                .replace(",", "") // remove year and time separator
                // change AM and PM format
                .replace("p.m.", "PM")
                .replace("a.m.", "AM");

            // Save timestamp
            this.created_on = timestamp;
        }
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