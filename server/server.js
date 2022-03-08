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

const corsOptions = {
    origin: 'http://localhost:3000',  //Your Client, do not write '*'
    credentials: true,
};
app.use(cors(corsOptions));

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

    console.log("MongoDB Connected");
});
const store = new MongoDBSession({
    uri : DB_Url,
    collection : 'mySessions'
});

app.use(session({
    secret : 'key that will sign cookie',
    resave : false,
    saveUninitialized : true,
    store : store,
    cookie : {
        httpOnly : true,
        maxage : 360000
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

const sessionTest = (req, res, next) => {
    //console.log(req.session.user);
    next();
}

//Login and Registration stuff
app.post('/login', (req, res)=>{
    //Get the password and username
    const {username, password} = req.body;
    new Promise((resolve, reject) => {
        //Query the database with the provided values
        con.collection("users").find({username : username}).toArray((err, result) => {
            if (err) { reject(err) } else {resolve(result)}
        });
    })
    .then((result) => {
        //Now we check if the encrypted passwords match
        const user = result[0];
        bcrypt.compare(password, user.password)
        .then((result) => {
            if (result) {
                //Add some user info to the cookie to make stuff easy in future
                const userInfo = {
                    isBasic : true,
                    isBookstore : true,
                    isAdmin : true,
                    username : user.username,
                    _id : user._id
                }
                req.session.user = userInfo;
                res.send("Success");
            } else {
                res.status(400).send("Password does not match");
            }
        })
        .catch((error) => {
            res.status(400).send(error);
        });
    })
    .catch((error) => {
        res.status(400).send(error);
    });
});


app.post("/register", (req, res)=> {
    //TODO make a proper implemetation 
    const {username, password, email, address1, address2, fName, lName} = req.body;

    new Promise((resolve, reject) => {
        con.collection("users").countDocuments(
            {$or : [{username : username}, {email : email}]}, (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        });
    })
    .then((result) => {
        if (result > 0) {
            throw "Username or email already in use"
        }
        bcrypt.hash(password, 12)
        .then((hashedPass) => {
            const newUser = {
                username : username,
                email : email,
                password : hashedPass,
                eddress1 : address1,
                address2 : address2,
                fName : fName,
                lName : lName,
                listings : []
                };
            con.collection("users").insertOne(newUser, (err, result) =>{
                if (err) { throw err } else {res.send("Success")}
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    })
    .catch((error) => {
        res.status(400).send(error);
    });
});

app.post("/registerBuisness", (req, res) => {
    //Get the information
    const {companyName, password, email, address1, address2} = req.body;

    new Promise((resolve, reject) => {
        con.collection("buisnessUsers").countDocuments(
            {$or : [{username : username}, {email : email}]}, (err, result => {
                if (err) {reject(err)} else {resolve(result)}
        }));
    })
    .then((result) => {
        bcrypt.hash(password, 12)
        .then((hashedPass) => {
            const newUser = {
                companyName : companyName,
                email : email,
                password : hashedPass,
                eddress1 : address1,
                address2 : address2,
                listings : [],
                };
            con.collection("buisnessUsers").insertOne(newUser, (err, result) => {
                if (err) { throw err } else {res.send("Success")}
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send(error);
    })
});

app.post('/logout', (req, res) => {
    res.session.destroy((err) => {
        if (err) throw err;
        //We can use this to redirect to landing page later
        res.send("logged out")
    });
});

app.get('/users', (req, res) => {
    new Promise((resolve, reject) => {
        con.collection("users").find({}).toArray((err, result) =>{
            if (err) {reject(err)} else {resolve(result)}
        }
    )})
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});
app.get('/bookStoreUsers', (_, res) => {
    new Promise((resolve, reject) => {
        con.collection("bookStoreUsers").find({}).toArray((err, result) =>{
            if (err) {reject(err)} else {resolve(result)}
        }
    )})
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});
//This will return user information from the given cookie
//Will return nothing if there is no cookie with user info
app.get('/isUser', (req, res) => {
    if(req.session.user == undefined){
        res.status(400).send("Not logged in")
    }
    else if(req.session.user.isBasic) {
        res.send("Success");
    } else {
        res.status(400).send("Not logged in")
    }
});



//All the implementation are from typing TODO change to button

//no picture implementation yet.TODO add a way to add pictures to the mongodb db
app.post('/make-lis' ,(req,res)=>{
    const {textname, description} = req.body;
	const datetime = new Date();
    const newListing = {
        name: textname,
        description: description,
        timestamp: datetime
    }
    new Promise((resolve, reject) => {
        //Add new listing to the database
        con.collection("listings").insertOne(newListing, (err, result) => {
            if(err) {reject(err)}  else { resolve(result)}
        });
    })
    .then((result) => {
        const addListing = {$push: {listings : result.insertedId}};
        con.collection("users").updateOne({username : req.session.user.username}, addListing);
    })
    .then((_) => {
        res.send("Success");
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

//See the listings on the browser 
app.get('/listings', (req,res) => {
	//console.log("here")
    new Promise((resolve, reject) => {
        con.collection("listings").find({}).toArray((err,result) => {
            if(err) {reject(err)} else{resolve(result)}
        }
    )}).then((result) => {
		//console.log("got here"+result.json)
        res.send(result);
    }).catch((error)=>{
        console.log("error!!!!!!!!!!!!!!!!!!!")
        res.status(400).send(error);
    })
});

//This will return all of a users listings
//Requires user to be logged in to return value
app.get('/user/listings', (req, res) => {
    const query = {username : req.session.user.username};

    new Promise((resolve, reject) => {
        con.collection.findOne(query, (err, result) => {
            if (err) { reject(err) } else { resolve(result) }
        });
    })
    .then((result) => {
        const listingIDs = {ids : []}
        result.listings.forEach(element => {
            listingIDs.ids.push(element);
        });
        const listingQuery = {_id : {$in : listingIDs.ids}};
        console.log(listingQuery);
        con.collection("listings").find(listingQuery).toArray((err, result2) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(result2);
            }
        });
    })
    .catch((error) =>{
        res.status(400).send(error);
    })
});

//Returns the listing for a given ID
app.get('/listing/:listingID', (req, res) => {
     const ObjectId = require('mongodb').ObjectId;
     const listingOID = new ObjectId(req.params.listingID);

     new Promise((resolve, reject) => {
         con.collection("listings").findOne({_id : listingOID}, (err, result) => {
             if (err) {reject(err)} else {resolve(result)}
         });
     })
     .then((result) => {
         res.send(result);
     })
     .catch((error) =>{
        res.status(400).send(error);
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
    //res.redirect("http://localhost:3000/");
    //res.send("Hey");
    res.redirect("http://localhost:3000/register");
});

app.use('/', express.static('pages'));

//FIXME: HTTPS server giving Error code: SSL_ERROR_RX_RECORD_TOO_LONG on firefox
//Create the Http server
http.createServer(app).listen(PORT, HOST);
//Create the identical https server
https.createServer(options, app).listen(443, HOST);

//app.listen(PORT, HOST);

console.log('up and running');
