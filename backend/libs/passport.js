// passport.js
const passport = require('passport');
const GooggleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../shema/User');
const jwt = require('jsonwebtoken');
const dbConnect = require('../libs/dbConnect');
require('dotenv').config();

passport.use(new GooggleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_APP_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_BACKEND,
  profileFields: ['id', 'displayName', 'emails']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        createdAt: Date.now()
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id , fullname:profile.emails[0].value }, process.env.JWT_SECRET, { expiresIn: '1h' });
    done(null, { profile, token });
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
  