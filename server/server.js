'use strict';

// load package
const express = require('express');
const app = express();
const session = require('express-session');
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
    store : store
}));

//Login and Registration stuff
app.post("/login", (req, res)=>{
    //Get the password and username
    let username = req.body.username;
    let password = req.body.password;

    new Promise((resolve, reject) => {
        //Query the database with the provided values
        con.collection("users").find({"username" : username, "password" : password}, (err, result) => {
            if (err) { reject(err) } else {resolve(result)}
        });
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
    let newUser = {"username" : username, "password" : password};

    new Promise((resolve, reject) => { 
        //Check if username is already in use
        if (0 < con.collection("users").find({"username" : username}).count()){
            throw "Username already in use";
        } else {
            resolve("");
        }
    })
    .then((result)=>{
        //If not in use add to users collection
        con.collection("users").insertOne(newUser, (err, result) =>{
            if (err) { reject(err) } else { resolve(result) }
        });
    })
    .then((result) => {
        //Maybe return a different value
        res.send(result);
    })
    .catch((error) => {
        res.send(error);
    });
});
 
//This is just to testing stuff
app.get('/', (req, res) => {
    req.session.isAuth = true;
    console.log(req.session);
    res.send("Success");
});

app.use('/', express.static('pages'));

//FIXME: HTTPS server giving Error code: SSL_ERROR_RX_RECORD_TOO_LONG on firefox
//Create the Http server
http.createServer(app).listen(PORT, HOST);
//Create the identical https server
https.createServer(options, app).listen(443, HOST);

//app.listen(PORT, HOST);

console.log('up and running');