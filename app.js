const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const MongoStore = require('connect-mongo');
// const HOST = "mongodb://mongo-server/";
const HOST = "mongodb://127.0.0.1/passport";


// connect DB, it can be in config.js file.
mongoose.connect(HOST, { useNewUrlParser: true,  useUnifiedTopology: true  } );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', ()=>{
  console.log('Connected to MongoDB');
  app.listen(3000, console.log(`Server listening on.. `));
})

var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session(
    {
      secret: 'keyboard dog',
      resave: false, // true to use flash 
      saveUninitialized: false, 
      store: MongoStore.create({ mongoUrl: HOST }),
      cookie: { maxAge: 600000 }
    }
));


 // -------------- PASSPORT AUTHENTICATION ----------------
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    console.log(req.session);
    console.log(req.user);
    next();
})

// Imports all of the routes from ./routes/index.js
app.use(routes);



//-------------- SERVER ----------------
