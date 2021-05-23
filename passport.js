const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;


const DB = 'passport';
const COLLECTION = 'users';

const HOST = "mongodb://127.0.0.1";
// const HOST = "mongodb://mongo-server"

function initialize(passport){
    passport.use(new LocalStrategy({ usernameField: 'email'}), authenticateUser);

    passport.serializeUser((user, done)=>{})
    // we want serialize user as single id
    passport.deserializeUser((id, done)=>{})

    const authenticateUser = function(email, password, done){
        const user = getUserByEmail(email)
        if(user == null){
            return done(null, false, {message: 'No user with that email.'})
        }
    }

    try{
        const product = await findProduct()
        if(await bcrypt.compare(passport, user.passport)){

        }
    }
    catch(err){

    }

}