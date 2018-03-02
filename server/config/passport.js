const passport = require('passport');
const User = require('../models/User');
const config = require('../config/config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create Local Strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify this email and password,  
    // If it is the correct email and password call done with the user
    // otherwise, call done with false
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err) }
        if (!user) { return done(null, false); }

        // Compare passwords: is 'password' == user.password?
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }
            // If passwords match
            return done(null, user);
        })
    })
})

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if user ID in the payload exists in our DB
    // If it does call 'done' with that user
    // otherwise (if err), call 'done' without a user obj
    User.findById(payload.sub, (err, user) => {
        if (err) { return done(err, false) }

        if (user) {
            done(null, user);
        } 
        else {
            done(null, false);
        }
    })
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);