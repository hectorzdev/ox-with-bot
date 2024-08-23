// passport.js
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../shema/User');
const jwt = require('jsonwebtoken');
const dbConnect = require('../libs/dbConnect');

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3333/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    await dbConnect();
    let user = await User.findOne({ facebookId: profile.id });

    if (!user) {
      user = new User({
        facebookId: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        createdAt: Date.now()
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id , fullname:profile.displayName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    done(null, { user, token });
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
  