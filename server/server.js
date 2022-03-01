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
const cors = require('cors');
app.use(cors());

var options = {
    key : fs.readFileSync(path.join(__dirname, "perms", "client-key.pem")),
    cert : fs.readFileSync(path.join(__dirname, "perms", "client-cert.pem"))
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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

    // create collections
    con.createCollection("users", (err, res) =>{
        if(err) throw err;
    })

    con.createCollection("listings", (err, res) =>{
        if(err) throw err;
    })
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
        const hasedPass = bcrypt.hash(password, 12);
        let newUser = {"username" : username, "password" : hasedPass};

        con.collection("users").insertOne(newUser, (err, result2) =>{
            if (err) { reject(err) } else { resolve(result2) }
        });
    })
    .then((result) => {
        //Maybe return a different value or ridirect to a new page
        res.redirect("http://localhost:3000/");
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


//All the implementation are from typing TODO change to button

//no picture implementation yet.TODO add a way to add pictures to the mongodb db
app.post('/make-lis',(req,res)=>{
	var textname = req.body.textname;
	//var condition = req.body.condition;
	var description = req.body.description;
	var datetime = new Date();
	console.log("the name of the texbook is: "+textname);
	console.log();
	function addlisting(varname,vardesc,datetime){
		MongoClient.connect(DB_Url,function(err,db){
			var dbo = db.db("ecomDB");
			var myobj = {name: varname, description: vardesc, timestamp: datetime};
			dbo.collection("listings").insertOne(myobj, function(err,response){
				if (err) throw err;
				console.log("inserted into listings succesfully");
				db.close();
			});
			
		});
	}
	addlisting(textname,description,datetime);
	res.send("yes")
});

//See the listings on the browser 
app.get('/listings',(req,res) => {
	//console.log("here")
    new Promise((resolve, reject) => {
        console.log(con.collection("listings").find({}).toArray((err,result) => {
            if(err) {reject(err)} else{resolve(result)}
        })
    )}).then((result) => {
		//console.log("got here"+result.json)
        res.send(result);
    }).catch((error)=>{
        console.log("error!!!!!!!!!!!!!!!!!!!")
        res.send(error);
    })
});




//John change this to button delete instead of deleting by name
//TODO figure out a delete by button once we actually implement it
app.post('/remove-lis',(req,res)=>{
	var name = req.body.name;
	function removelis(varname){
	MongoClient.connect(DB_Url,function(err,db){
	  if (err) throw err;
		var dbo = db.db("ecomDB");
		var myquery = { name: varname};
		dbo.collection("listings").deleteOne(myquery, function(err,response){
			if (err) throw err;
			console.log("1 listing deleted");
			db.close();
			});
		});
	}
	removelis(name);
	res.redirect("/main");
});

//This is for updating listing, you can update by button press (needs to be implemented by john)
app.post('/update_lis',(req,res)=>{
	var textname = req.body.name;
	var condition = req.body.condition;
	var description = req.body.descript;
	function addchild(varname,varcon,vardesc){
	MongoClient.connect(DB_Url,function(err,db){
	  if (err) throw err;
		var dbo = db.db("ecomDB");
		var myquery = { name: varname};
		if(varcon.length == 0 && vardesc.length == 0){
			console.log("Nothing to update");
		}
		else if(varcon.length == 0){
		var newvalues = { $set: {description: vardesc}};
		dbo.collection("children").updateOne(myquery, newvalues, function(err,response){
			if (err) throw err;
			console.log("only description updated");
			db.close();
			});
		
		} else if(vardesc.length == 0){
		var newvalues = { $set: {condition: varcon}};
		dbo.collection("children").updateOne(myquery, newvalues, function(err,response){
			if (err) throw err;
			console.log("only condition updated");
			db.close();
			});
		} else{
		var newvalues = { $set: {condition: varcon, description: vardesc}};
		dbo.collection("children").updateOne(myquery, newvalues, function(err,response){
			if (err) throw err;
			console.log("1 document updated");
			db.close();
			});
			}
		});
	}
	addchild(name,condition,description);
	res.redirect("/postingpage");
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Maybe we should talk about the offers part of this project. /////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/make-offer',(req,res)=>{
	var name = req.body.name;
	var subject = req.body.sub; //this is suppopsed to be the name of the textbook you are making an offer for. TODO make sure to find out how to get the specific name
	var reason = req.body.reason;
	var datetime = new Date();
	function addoffer(varname,varsubject,varreason,date){
		MongoClient.connect(DB_Url,function(err,db){
			var dbo = db.db("ecomDB");
			var myobj = {name: varname, subject: "offer for: " + varsubject, reason: varreason, timestamp: datetime};
			dbo.collection("offers").insertOne(myobj, function(err,response){
				if (err) throw err;
				console.log("inserted into offers succesfully");
				db.close();
			});
			
		});
	}
	addoffer(name,subject, reason, datetime);
	res.redirect("/main");
});



//This was to get the offers and to display them (might change depending on how john actually wants to implement this.)
//maybe also use this for messages in general
//i have it grab all from one subject maybe figure out how to automatically get it from pushing reply (maybe just have the offer button on each posting instead)
app.get('/get-offers',function(req,res){    
    var subject = req.body.sub;//change this
    var options = {
        root: path.join(__dirname)
    };
	var resultArray = [];
	MongoClient.connect(DB_Url,function(err,db){
	  if (err) throw err;
	  	var dbo = db.db("ecomDB");
	  	var cursor = dbo.collection('offers').find(subject);
		cursor.forEach(function(doc,err){
			if (err) throw err;
			resultArray.push(doc);
		}, function(){
			console.log(resultArray);
			db.close();
			res.send(resultArray);
		});
	});
});



 
//This is just to testing stuff
app.get('/', (req, res) => {
    console.log(req.session);
    //res.redirect("http://localhost:3000/");
    //res.send("Hey");
    res.redirect("https://localhost:3000/register");
});

app.use('/', express.static('pages'));

//FIXME: HTTPS server giving Error code: SSL_ERROR_RX_RECORD_TOO_LONG on firefox
//Create the Http server
http.createServer(app).listen(PORT, HOST);
//Create the identical https server
https.createServer(options, app).listen(443, HOST);

//app.listen(PORT, HOST);

console.log('up and running');
