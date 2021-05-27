const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validatePassword = require('../lib/passwordUtils').validatePassword;
const User = require('../config/db');


// becasue passport local strategy requires identical parameter's names, 
//we can define custom names to avoid the strict rules of passport local strategy, above as an object.
const verifyCallback = function(username, password, done){
    console.log('finding user...')
    User.findOne({username: username})
    .then(user=>{
        if(!user){
            return done(null, false)
        }
        // validate password, if it is right...
        const isValid = validatePassword(password, user.hash, user.salt); //call the function in passwordUtils.js
        console.log(password, user.salt, user.hash);

        if(isValid){
            console.log('usesr validated in passport.js')
            return done(null, user);
        }
        else{
            return done(null, false)
        }
    })
    .catch(err=>{
        done(err);
    })
}

// configure local strategy that not in the documentation
// it requiers a verified callback, so we define it above. 

const strategy = new LocalStrategy(verifyCallback);

// TODO: passport.use();
passport.use(strategy);

// using session, we use user into the session or out of the session. 
passport.serializeUser((user, done)=>{
    done(null, user.id); // putting user id into the session. 
});
// when user want to come out of the session
passport.deserializeUser((userId, done)=>{
    User.findById(userId)   // we grab userId, stored in session, and find it in the db
    .then((user)=>{
        done(null, user)
    })
    .catch(err=>{
        done(err);
    })
});
