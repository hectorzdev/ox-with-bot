const express = require('express')
const passport = require('passport');
const router = express.Router()
require('../libs/passport');
require('dotenv').config();

const { saveResult , user , users , deleteAccount } = require('../controllers/UserController');

router.post('/save-result' , saveResult)
router.post('/user' , user)
router.post('/users' , users)
router.post('/auth/delete', deleteAccount);
router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.token;       
    const GOOGLE_CALLBACK_FRONTEND = process.env.GOOGLE_CALLBACK_FRONTEND
    res.redirect(`${GOOGLE_CALLBACK_FRONTEND}?token=${token}`);
});

module.exports = router