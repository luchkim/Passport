const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// const ObjectId = require('mongodb').ObjectId;


const DB = 'passport';
const COLLECTION = 'users';

const HOST = "mongodb://127.0.0.1";
// const HOST = "mongodb://mongo-server"

function initialize(passport, getUserByEmail){
    passport.use(new LocalStrategy({ usernameField: 'email'}), authenticateUser);

    passport.serializeUser((user, done)=>{done(null, user)})
    passport.deserializeUser((id, done)=>{done(null, id)})

    const authenticateUser = function(email, password, done){
        getUserByEmail(email)
        if(user == null){
            return done(null, false, {message: 'No user with that email.'})
        }

        try{
            const user = await findUser(user.email);
            if(user){
                if(await bcrypt.compare(password, user.password)){
                    // if user password is match
                    return done(null, user)
                }
                else{
                    return done(null, false, {message: 'Password incorrect.'})
                }
            }
        }
        catch(err){
            return done(err)
        }
    }
}



async function findUser(email){
    const client = mongodb.MongoClient(HOST, {useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    try{
        const db = client.db(DB);
        const collection = db.collection(COLLECTION);
        
        const product = await collection.findOne({email: email});
        return product;
    }
    catch(err){
        console.log('Insert Product catch=>', err)
    }
    finally{
        await client.close();
    }
}

module.exports = initialize;