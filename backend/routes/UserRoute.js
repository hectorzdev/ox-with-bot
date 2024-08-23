const express = require('express')
const passport = require('passport');
const router = express.Router()
require('../libs/passport');

const { login } = require('../controllers/UserController');

router.post('/login' , login)
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;       
    console.log('token' ,token)
    res.redirect(`http://localhost:3000?token=${token}`);
});

module.exports = router