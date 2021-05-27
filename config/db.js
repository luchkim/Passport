  
const mongoose = require('mongoose');


// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});


const User = module.exports = mongoose.model('User', UserSchema);
