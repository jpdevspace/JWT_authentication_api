const jwt = require('jwt-simple');
const User = require('../models/User');
const config = require('../config/config');

const tokenForUser = user => {
    // sub stands for subject (it's convention)
    // iat stands for issued at time
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
    // User has already had their email and password authenticated
    // We just need to give them a token
    res.send({ token: tokenForUser(req.user) })
}

exports.signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // Check that all fields are filled
    if (!email || !password) {
        return res.status(422).send({ error: 'You must provide both email and password' });
    }

    // Check if user with a given email exists
    User.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }
        
        // If user with email does exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' });
        }
        // If a user with email does NOT exists, create it AND save user record
        const user = new User({
            email: email,
            password: password
        });

        user.save((err) => {
            if (err) { return next(err) }
            
            // Respond to request indicating the user was created
            res.json({ token: tokenForUser(user) });
        })
    }); 
}