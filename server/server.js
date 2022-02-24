'use strict';

// load package
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require("body-parser");
const MongoDBSession = require('connect-mongodb-session')(session);


var options = {
    key : fs.readFileSync(path.join(__dirname, "perms", "client-key.pem")),
    cert : fs.readFileSync(path.join(__dirname, "perms", "client-cert.pem"))
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());


const PORT = 8000;
const HOST = '0.0.0.0';


// Helper
const panic = (err) => console.error(err)

//Database stuff
const MongoClient = require('mongodb').MongoClient;
const DB_Url = 'mongodb://admin:admin@mongodb:27017/';
var con;

// Connect to database
MongoClient.connect(DB_Url, (err, db) =>{
    //This will connec thte node server to the mongo server on startup
    if (err) throw err;
    //We can change the name later
    con = db.db("ecomDB");

    console.log("MongoDB Connected");
});
const store = new MongoDBSession({
    uri : DB_Url,
    collection : 'mySessions'
});

app.use(session({
    secret : 'key that will sign cookie',
    resave : false,
    saveUninitialized : false,
    store : store,
    cookie : {
        httpOnly : true,
        maxAge : 3600000
    }
}));

//This can be used to redirect users from pages the cannot access without be logged in
//E.G. app.get('/', isAuth, (req, res) =>
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        //We can change this later
        res.send("not logged in");
    }
}

//Login and Registration stuff
app.post('/login', (req, res)=>{
    //Get the password and username
    let username = req.body.username;
    let password = req.body.password;
    
    new Promise((resolve, reject) => {
        //Query the database with the provided values
        con.collection("users").find({"username" : username}, (err, result) => {
            if (err) { reject(err) } else {resolve(result)}
        });
    })
    .then((result) => {
        //Now we check if the encrypted passwords match
        var isMatch = bcrypt.compare(password, result.password);

        if (!isMatch) throw "Not a match"
        //Temporary just to make the session logged in
        //May want to change this to something that also includes account type later
        req.session.isAuth = true
    })
    .then((result) => {
        //Filler until we implement cookies
        res.send("Logged in");
    })
    .catch((error) => {
        res.send(error)
    });
});


app.post("/register", (req, res)=> {
    //TODO make a proper implemetation 
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let address1 = req.body.address1;
    let address2 = req.body.address2;
    let fName = req.body.fName;
    let lName = req.body.lName;

    console.log(req.body);
    new Promise((resolve, reject) => { 
        //Check if username or email is already in use
        if (0 < con.collection("users").find({$or : [{username : username}, {email : email}]}).count()){
            throw "Username already in use";
        } else {
            resolve("");
        }
    })
    .then((result)=>{
        //If not in use add to users collection
        const hashedPass = bcrypt.hash(password, 12);
        let newUser = {
            username : username,
            password : hashedPass,
            email : email,
            address1 : address1,
            address2 : address2,
            fName : fName,
            lName : lName
            };
        con.collection("users").insertOne(newUser, (err, result2) =>{
            if (err) { reject(err) }
        });
    })
    .then((result) => {
        //Maybe return a different value or ridirect to a new page
        //res.redirect("https://localhost:3000/login");
        res.send("success");
    })
    .catch((error) => {
        res.send(error);
    });
});

app.post('/logout', (req, res) => {
    res.session.destroy((err) => {
        if (err) throw err;
        //We can use this to redirect to landing page later
        res.send("logged out")
    });
});
 
//This is just to testing stuff
app.get('/', (req, res) => {
    console.log(req.session);
    //res.redirect("http://localhost:3000/");
    //res.send("Hey");
    res.redirect("http://localhost:3000");
});

app.use('/', express.static('pages'));

//FIXME: HTTPS server giving Error code: SSL_ERROR_RX_RECORD_TOO_LONG on firefox
// //Create the Http server
// http.createServer(app).listen(PORT, HOST);
// //Create the identical https server
// https.createServer(options, app).listen(443, HOST);

app.listen(PORT, HOST);

console.log('up and running');