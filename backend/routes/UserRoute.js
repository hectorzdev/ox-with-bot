const express = require('express')
const passport = require('passport');
const router = express.Router()
require('../libs/passport');

const { saveResult , user } = require('../controllers/UserController');

router.post('/save-result' , saveResult)
router.post('/user' , user)
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;       
    res.redirect(`http://localhost:3000?token=${token}`);
});

module.exports = router