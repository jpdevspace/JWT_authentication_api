const express = require('express');
const router = express.Router();
const passport = require('passport');
const Authentication = require('../controllers/authentication');
const passportService = require('../config/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

router.get('/', (req, res, next) => {
    res.send(["a", "b", "c"])
});

router.get('/protected', requireAuth, (req, res) => {
    res.send({ message: 'You are authenticated' })
})

router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

module.exports = router;
