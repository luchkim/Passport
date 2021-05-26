const express = require('express');
const bcrypt = require('bcrypt');
const mongodb = require("mongodb");
const passport = require('passport');

const app = express();
const HOST = "mongodb://127.0.0.1";
// const HOST = "mongodb://mongo-server"

const initializePassport = require('./passport');

initializePassport(passport, async (email)=>{
    let user = await findUser(email);
    
    console.log(user);

    return user;
})


const DB = 'passport';
const COLLECTION = 'users';

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))


app.get('/', (req, res)=>{
    res.render('index.ejs', {name: 'Luke'})
})

app.get('/login', (req, res)=>{
    res.render('login.ejs')
})
app.post('/login', (req, res)=>{
    res.render('login.ejs')
})

app.get('/register', (req, res)=>{
    res.render('register.ejs')
})
app.post('/register',  async (req, res)=>{
    try{
        if(req.body.password == req.body.confirm_password){
            const hash = await bcrypt.hash(req.body.password, 10);
            await insertData(req.body.name, req.body.email, hash);
            
            res.redirect('/login')
        }
    }
    catch(err){
        res.redirect('/register')
        console.log(err)
    }
    console.log(users)
})


async function insertData(name, email, hash){
    const client = mongodb.MongoClient(HOST, { useUnifiedTopology: true });
    await client.connect();

    const database = client.db(DB);
    const collection = database.collection(COLLECTION);

    const data ={
        name: name, 
        email: email,
        password: hash
    }

    await collection.insertOne(data);
    await client.close();
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












app.listen(3000, console.log('server is running...'))