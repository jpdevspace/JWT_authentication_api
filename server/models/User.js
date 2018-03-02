const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true }
});

// On save hook, encrypt password
// Before saving a model run this function
// WARNING!!! Don't use ES6 () => {} it prevents the binding of this in const user = this;
userSchema.pre('save', function(next){  
    // Get access to the user model
    const user = this;

    // Generate Salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err) }

        // Hash/Encrypt password using the Salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            // Overwrite plain text password with encrypted password
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return callback(err); }

        callback(null, isMatch);
    })
}

// Create the model class
const UserModel = mongoose.model('user', userSchema);

// Export the model
module.exports = UserModel;