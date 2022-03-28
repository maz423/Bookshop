'use strict';

// load package
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require("bcryptjs");
const path = require('path');
//const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require("body-parser");
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const fs = require('fs-extra');
const multerHelper = require(path.join(__dirname, "multerHelper"));

require('dotenv/config');


var options = {
    key : fs.readFileSync(path.join(__dirname, "perms", "client-key.pem")),
    cert : fs.readFileSync(path.join(__dirname, "perms", "client-cert.pem"))
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require('cors');
const { resolve } = require('path');
const corsOptions = {
    origin: 'http://localhost:3000',  //Your Client, do not write '*'
    credentials: true,
};
app.use(cors(corsOptions));

const userCollection = 'users';
const bookstoreCollection = 'bookstoreUsers';
const listingsCollection = 'listings';
const adminCollection = 'admins';
const offersCollection = 'offers';

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

    const adminQuery = {
        username : "admin"
    }
    //Add an admin account
    new Promise((resolve, reject) => {
        con.collection(adminCollection).countDocuments(adminQuery, (err, result)=> {
            if (err) {reject(err)} else {resolve(result)}
        })
    })
    .then((result) => {
        if (result > 0) {
            console.log("MongoDB Connected");
            return
        }
        else {
            const password = "admin"
            bcrypt.hash(password, 12)
            .then((hashedPass) => {
                const newAdmin = {
                    username : "admin",
                    password : hashedPass
                }
                con.collection(adminCollection).insertOne(newAdmin, (err, result) => {
                    if (err) {throw err} else {console.log("MongoDB Connected");}
                })
            })
        }
    })
    .catch((error) => {
        console.log("error initializing DB");
        return;
    })
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

//this is to connect mongoose to our database
mongoose.connect(DB_Url,
	{ useNewUrlParser: true, useUnifiedTopology: true}, err => {
		console.log('mongoose connected')
	});


//loading the mongoose model for the imageSchema
var imgModel = require('./model')

app.get('/isLoggedIn', (req, res) => {
    if (!req.session.user){
        res.status(400).send("Not logged in")
    } else if (req.session.user.isBasic || req.session.user.isBookstore || req.session.user.isAdmin){
        res.send("Logged in");
    } else {
        res.status(400).send("Not logged in");
    }
});

//Login and Registration stuff
app.post('/login', (req, res)=>{
    //Get the password and username
    const {username, password, accountType} = req.body;
    //Set a default value of users for collection
    //Then Switch it if accountType is not user
    let collection = userCollection;
    let query = {username : username};
    if (accountType == "Bookstore"){
        collection = bookstoreCollection;
        query = {companyName : username};
    } else if (accountType == "Admin"){
        collection = adminCollection;
    }
    //Now check if we were not given basic send an error 
    else if (accountType != "User"){
        res.status(400).send(accountType + " is not a valid account type");
        return;
    }

    new Promise((resolve, reject) => {
        //Query the database with the provided values
        con.collection(collection).find(query).toArray((err, result) => {
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
                    isBasic : false,
                    isBookstore : false,
                    isAdmin : false,
                    username : username,
                    _id : user._id
                }
                
                if (accountType == "User") {
                    userInfo.isBasic = true;
                } else if (accountType == "Bookstore"){
                    userInfo.isBookstore = true;
                } else if (accountType == "Admin"){
                    userInfo.isAdmin = true;
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
        console.log(error);
        res.status(400).send(error);
    });
});


app.post("/register", (req, res)=> {
    //TODO make register handle both basic and bookstore accounts
    const {username, password, email, address1, address2, fName, lName, city, province, zipcode} = req.body;

    new Promise((resolve, reject) => {
        con.collection(userCollection).countDocuments(
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
                address1 : address1,
                address2 : address2,
                fName : fName,
                lName : lName,
                city : city,
                province : province,
                zipcode: zipcode,
                profilePicture : "",
                listings : [],
                wishlist : [],
                };
            con.collection(userCollection).insertOne(newUser, (err, result) =>{
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
    });
});

app.post("/registerBookstore", (req, res) => {
    //Get the information
    const {companyName, password, email, address1, address2, city, province, zipcode} = req.body;

    new Promise((resolve, reject) => {
        con.collection(bookstoreCollection).countDocuments(
            {$or : [{companyName : companyName}, {email : email}]}, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
        });
    })
    .then((result) => {
        if (result > 0) {
            throw "Company name or email is already in use";
        }
        bcrypt.hash(password, 12)
        .then((hashedPass) => {
            const newUser = {
                companyName : companyName,
                email : email,
                password : hashedPass,
                address1 : address1,
                address2 : address2,
                city : city,
                province : province,
                zipcode : zipcode,
                listings : [],
                profilePicture : "",
                brandingImage : "",
                };
            con.collection(bookstoreCollection).insertOne(newUser, (err, result) => {
                if (err) { throw err } else {
                    console.log("success");
                    res.send(result.insertedId);
                }
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
    req.session.destroy((err) => {
        if (err) throw err;
        console.log("logged out");
        //We can use this to redirect to landing page later
        res.send("logged out")
    });
});

app.get('/users', (req, res) => {
    new Promise((resolve, reject) => {
        con.collection(userCollection).find({}).toArray((err, result) =>{
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

app.get('/user', (req, res) => {
    //TODO make handle different account types
    if (req.session.user == undefined) {
        res.status(400).send("Not logged in");
    }
    else {
        new Promise((resolve, reject) => {
            //TODO Maybe refactor so that we have a function that returns location information
            //Then have user and bookstore to get all the information
            let collection = userCollection;
            if (req.session.user.isBookstore){
                collection = bookstoreCollection;
            }

            const query = {_id : req.session.user._id};
            const projection ={
                projection:{
                    password : 0
                }
            }
            con.collection(collection).findOne(query, projection, (err, result) => {  
                if (err) {reject(err)} else {resolve(result)}
            });
        })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(400).send("User not found");
        })
    }
});

app.get('/user/:userID', (req, res) => {
    //This will return some baisc information about the user being requested
    const ObjectId = require('mongodb').ObjectId;
    const userID = new ObjectId(req.params.userID);

    new Promise((resolve, reject) => {
        const query = {_id : userID}
        //Use field : 1 inside of projection to include in return
        //Use field : 0 inside of projection to exclude in return 
        const projection = {
            projection: {
                password : 0
            }
        }
        con.collection(userCollection).findOne(query, projection, (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        });
    })
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});

app.get('/bookstore', (req, res) => {
    //Returns the currently loggeed in bookstore's information
    if (req.session.user == undefined) {
        res.status(400).send("Not logged in");
    }
    else if (!req.session.user.isBookstore){
        res.status(400).send("Not a basic user")
    }
    else {
        new Promise((resolve, reject) => {
            const query = {_id : req.session.user._id}
            const projection = {
                projection : {
                    password : 0
                }
            }
            con.collection(bookstoreCollection).findOne(query, projection, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(400).send(error);
        });
    }
});

app .get('/bookstore/:bookstoreID', (res, req) => {
    //This will return some baisc information about the user being requested
    const ObjectId = require('mongodb').ObjectId;
    const bookstoreID = new ObjectId(req.params.bookstoreID);

    new Promise((resolve, reject) => {
        const query = {_id : bookstoreID}
        const projection = {
            projection: {
                password : 0
            }
        }
        con.collection.findOne(query, projection, (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        })
        .then((result) => {
            res.send(result);
        })
        .catch((error) => {
            res.status(400).send(error);
        })
    })
});


app.get('/bookstoreUsers', (_, res) => {
    new Promise((resolve, reject) => {
        con.collection(bookstoreCollection).find({}).toArray((err, result) =>{
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
        res.status(400).send("Not logged in");
    }
    else if(req.session.user.isBasic) {
        res.send("Success");
    } else {
        res.status(400).send("Not logged in");
    }
});


app.post('/regularSearch', (req, res) =>{

    let keyword = req.body.keyword;


        // query the database for all the listings that match just the keyword


        const pipeline = [
            { $match: { title: { $regex: keyword, $options: "i" } } },
        ];


        async function performSearch(){
            try{
                const listings = await con.collection("listings");
                const aggCursor = await listings.aggregate(pipeline);
                return aggCursor.toArray();
            }
            catch(error){
                console.error(error);
            }
        };

        (async function() {
            let searchResults = await performSearch();
            console.log(searchResults);
            console.log(searchResults[0]);
            res.send(searchResults);
        })();

});


app.post('/advancedSearch', (req, res) =>{

    let keyword = req.body.keyword;
    //let subject = req.body.subject;
    // let value = req.body.value;
    let author = req.body.author;
    let price = req.body.price;
    let city = req.body.location;

    const pipeline = [
        { $match: { title: { $regex: keyword, $options: "i" }, price: { $lte: price }, 
        authorName: { $regex: author, $options: "i" }, city: { $regex: city, $options: "i" } } },
    ];


    async function performSearch(){
        try{
            const listings = await con.collection("listings");
            const aggCursor = await listings.aggregate(pipeline);
            return aggCursor.toArray();
        }
        catch(error){
            console.error(error);
        }
    };

    (async function() {
        let searchResults = await performSearch();
        console.log(searchResults[0]);
        res.send(searchResults);
    })();
});

//All the implementation are from typing TODO change to button

//no picture implementation yet.TODO add a way to add pictures to the mongodb db
app.post('/make-lis' ,(req,res)=>{
    const {title, authorName, description, price, address1, address2, city, province, zipCode} = req.body;
	const datetime = new Date();
    //TODO check if location information is given, if not user session info
    const newListing = {
        title: title,
        authorName : authorName,
        description: description,
        price : price,
        address1 : address1,
        address2 : address2,
        city : city,
        province : province,
        zipCode : zipCode,
        timestamp: datetime,
        postedByStore : req.session.user.isBookstore,
        posterID : req.session.user._id,
        posterName : req.session.user.username,
        imageNames : [],
    }

    new Promise((resolve, reject) => {
        //Add new listing to the databasesession
        con.collection(listingsCollection).insertOne(newListing, (err, result) => {
            if(err) {reject(err)}  else { resolve(result)}
        });
    })
    .then((result) => {
        //TODO add account type detection
        let collection = userCollection;
        if (req.session.user.isBookstore){
            collection = bookstoreCollection;
        }

        const addListing = {$push: {listings : result.insertedId}};
        con.collection(collection).updateOne({_id : req.session.user._id}, addListing, (err, result2) => {
            if (err) {throw err} else {res.send(result.insertedId)}
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

//John change this to button delete instead of deleting by name
//TODO figure out a delete by button once we actually implement it
app.post('/remove-lis',(req,res)=>{
	const {title} = req.body; //for now have it as the title TODO change to id from button press
	const myquery = { title: title};
	new Promise((resolve, reject) => {
		con.collection(listingsCollection).deleteOne(myquery, function(err,response){
			if (err) {
			console.log(err);
			} else{
			console.log('listing deleted')	
			}
		});
	})
	.then((result) => {
        res.send(result);
    	})
    	.catch((error) => {
        res.status(400).send(error);
    	});
});

//This is for updating listing, you can update by button press (needs to be implemented by john), TODO make the old data autofill also put errors for when there isn't any items in the form
app.post('/update_lis',(req,res)=>{
	const {title, authorName, description, price, address1, address2, city, province, zipCode} = req.body;
	var myquery = { title: title}; //will probably have to change this to id
	new Promise((resolve, reject) => {
		var newvalues = { $set: {title, authorName, description, price, address1, address2, city, province, zipCode}};
		con.collection(listingsCollection).updateOne(myquery, newvalues, function(err,response){
			if (err) throw err;
			});
		})
		.then((result) => {
        	res.send(result);
    		})
    		.catch((error) => {
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
        con.collection(listingsCollection).find(listingQuery).toArray((err, result2) => {
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
     var usera='';
    console.log(req.session.user);

     new Promise((resolve, reject) => {
         con.collection(listingsCollection).findOne({_id : listingOID}, (err, result) => {
             if (err) {reject(err)} else {resolve(result)}
         });
     })
     .then((result) => {
        if (req.session.user != undefined){
            //console.log("here")
               usera = req.session.user.username;
               
               result.user=usera;
            //   console.log(result.user);
           }//
         //console.log(result);
         res.send(result);
     })
     .catch((error) =>{
        res.status(400).send(error);
    })
});

//Used to get a number of listings from a given "page" based on the number per page
app.get('/listings/:numberOfListings/:pageNumber', (req, res) => {
    const numberOfListings = parseInt(req.params.numberOfListings);
    const pageNumber = parseInt(req.params.pageNumber);

    let skip = (pageNumber - 1) * numberOfListings;

    if (numberOfListings == NaN || pageNumber == NaN || pageNumber < 1){
        res.status(400).send("error with parameters");
        return;
    }

    new Promise((resolve, reject) => {
        con.collection(listingsCollection).find({}).limit(numberOfListings).skip(skip).toArray((err, result) => {
            if (err) { reject(err) } else {resolve(result)}
        });
    })
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send(error);
    });
});

app.put('/update_user',(req,res)=>{
    const oldUser=req.body.oldUserName;
    const { username, email, address1, address2, fName, lName, city, province, zipcode} = req.body;
;   let params = {username, email, address1, address2,fName, lName, city, province, zipcode};
    for(let prop in params) if(!params[prop]) delete params[prop];

    if (req.session.user == undefined) {
        console.log("Got here");
        res.status(400).send("Not logged in");
    } 
    else {
        new Promise((resolve, reject) => {
            const query = {_id : req.session.user._id};
            con.collection(userCollection).updateOne(query,{$set: params},(err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        })
    }
});

//SPAGHETTI!!!! CODE. WILL FIX IF TIME PERMITS BUT WORKS
app.post('/make-offer',(req,res)=>{

    var guest = req.body.guest //Checks if the buyer is a logged in user or a guest buyer
    var email = req.body.email 
	var posterName = req.body.posterName; //Name of the user who listed the textbook 
    var listingID = req.body.listingID 
	var title = req.body.title; //Name of the textbook 
	var offer = req.body.offer;//Contains the description of the textbook 
	var datetime = new Date();
    var offersL = '';
    if (guest==true){
        offersL = {
            name:"guest",
            email: email,
            guest: guest,
            title:title,
            offer: offer,
            listingID:listingID,
            date: datetime
        }
    }
    else {
        var nameUserOffer= req.body.nameUserOffer//if the offer is from someone who is logged in give the object the name 
        offersL = {
            name: nameUserOffer,
            email: email,
            guest: guest,
            title:title,
            offer: offer,
            listingID:listingID,
            date: datetime
        }
    }

    console.log("Offering now" );
    console.log(offersL);
    //console.log(email," ", phone_number," ",posterName," ",title)
    new Promise((resolve, reject) => {
            con.collection(offersCollection).countDocuments(
                {_id : posterName}, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        }).then((result) => {
            let resultArray=[];
            if (result <= 0){
                //Initialize the document and offers array
                console.log("Insert One");
                con.collection(offersCollection).insertOne({_id:posterName,offers:[offersL]},(err,result) =>{
                    if (err) {console.log(err)} else {console.log(result)}
                })
                // //Then append to the array field offer
                // con.collection(offersCollection).updateOne({_id:posterName},{$addToSet: {offers:offersL}},(err,result) => {
                //     if (err) {console.log(err)} else {console.log(result)}
                // })
                // con.collection(offersCollection).find({_id:posterName}).forEach(function(doc,err){
                //     if (err) throw err;
                //     resultArray.push(doc);
                // }, function(){
                //     console.log(resultArray.forEach(function(x){
                //      console.log("Whole db",resultArray);
                //      console.log(x.offers);
 
                //     }));});
            }
            else{
                //Updating into the document instead 
                let resultArray=[];
                console.log("Updating instead");
                // con.collection("offers").update({_id:posterName},{$addToSet: {email:email,listingID:listingID}},(err,result) => {
                //     if (err) {console.log(err)} else {console.log(result)}
                // })
                new Promise((resolve, reject) => {
                con.collection(offersCollection).countDocuments({_id:posterName, offers: {$elemMatch:{email:email,listingID:listingID}}},(err,result) =>{
                    if (err) {reject(err)} else {resolve(result)}
                })
            }).then((result)=>{
                console.log(result);
                    if (result <= 0){
                        console.log("here")
                        con.collection(offersCollection).updateOne({_id:posterName},{$push: {offers:offersL}})
                    }
                })
            }
        })
        let resultArray=[]
        con.collection(offersCollection).find({_id:posterName}).forEach(function(doc,err){
            if (err) throw err;
            resultArray.push(doc);
        }, function(){
            console.log(resultArray.forEach(function(x){
             console.log("Whole db",resultArray);
             console.log(x.offers);

            }));});
    //The offer is from a user. Bookstores won't have the option of creating an offer ???? 
	res.redirect("/main");
});


//TODO figure out a delete by button once we actually implement it
app.post('/remove-offers',(req,res)=>{
	var posterName = req.session.user.username; ; //for now have it as the title TODO change to id from button press
	const myquery = {_id : posterName}; //query for finding the offers for the user
	const email = req.body.email //query for the actual offer
    const listingID = req.body.lid
    console.log("REMOVING OFFERS.........");
    console.log(posterName);
    console.log(email);
    console.log(listingID)
	new Promise((resolve, reject) => {
		con.collection("offers").updateOne(myquery,{$pull: { offers: {email: email,listingID:listingID}}}, function(err,response){
			if (err) {
			reject(err)
			} else{
			resolve(response)
			}
		});
	})
	.then((result) => {
        res.send(result);
    	})
    	.catch((error) => {
        res.status(400).send(error);
    	});
});


//This was to get the offers and to display them (might change depending on how john actually wants to implement this.)
//maybe also use this for messages in general
//i have it grab all from one subject maybe figure out how to automatically get it from pushing reply (maybe just have the offer button on each posting instead)
app.get('/get-offers',function(req,res){ 
    console.log("GETTING OFFERS!!!!!!!!!!!!!!!");
    var posterName  = req.session.user.username;
    new Promise((resolve, reject) => {
        
        con.collection("offers").findOne({_id: posterName},(err,result) => {
            if(err) {reject(err)} else{resolve(result)}
        }
    )}).then((result) => {
		console.log(result);
        console.log(result._id);
        console.log(result.offers)
        res.send(result.offers);
    }).catch((error)=>{
        console.log("error!!!!!!!!!!!!!!!!!!!")
        res.status(400).send(error);
    })
});


app.post('/add-to-wishlist', (req, res) => {

    var listingID = req.body.listingID;       // this is the id of the listing to be added to the wishlist
    var user = req.session.user.username;
    //var userID = req.body.userID;
    console.log(listingID);

    async function addToWishlist(){

        try{
            const users = await con.collection(userCollection);

            await users.updateOne({username : user}, {$push : {wishlist : listingID}});

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        await addToWishlist();

        res.send("ok");
    })();


});


app.post('/remove-from-wishlist', (req, res) => {

    var listingID = req.body.listingID;
    var user = req.session.user.username;

    async function removeFromWishlist(){
        
        try{
            const users = await con.collection(userCollection);

            await users.updateOne({username : user}, {$pull : {wishlist : listingID}});

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        await removeFromWishlist();

        res.send("ok");
    })();


})


app.post('/wishlist', (req, res) => {

    //var id = req.body.id;
    var username = req.session.user.username;

    async function getUser(){

        try{
            const users = await con.collection(userCollection);

            let user = await users.findOne({username : username});

            return user;
        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }

    };

    async function getWishlist(user){

        try{

            const listingIDs = [];

            const ObjectId = require('mongodb').ObjectId;

            const userWishlist = await user.wishlist;

            for await (const listingID of userWishlist){
                let listingOID = new ObjectId(listingID);
                listingIDs.push(listingOID);
            }

            return listingIDs;

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }


    };

    async function getListings(listingIDs){

        try{

            const listings = await con.collection(listingsCollection);

            const books = [];

            for await (const listingID of listingIDs){



                let listing = await listings.findOne({_id : listingID});

                console.log(listing);

                await books.push(listing);

            }

            return books;


        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }


    };

    (async function() {

        var user = await getUser();

        var wishlist = await getWishlist(user);

        var listings = await getListings(wishlist);

        res.send(listings);


    })();





});

app.get('/test', (_,res)=> {
    const query ={}
    const returnStuff = {
        projection : {
            username : 1
        }
    }

    new Promise((resolve, reject)=> {
        con.collection(userCollection).find(query, returnStuff).toArray( (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        })
    })
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.send(error);
    });
});

app.post('/uploadImage', multerHelper.uploadImage, (req, res) => {
    const dir = req.body.directory;
    let addImage = {$push : {imageNames : req.file.filename}};
    let collection = listingsCollection;

    //Check if we are not adding an image for a listing
    if (dir == "bookstores"){
        addImage = {$set : {profilePicture: req.file.filename}};
        collection = bookstoreCollection;
    } else if (dir == "users") {
        addImage = {$set : {profilePicture: req.file.filename}};
        collection = userCollection;
    } else if (dir == "branding") {
        addImage = {$set : {brandingImage: req.file.filename}};
        collection = bookstoreCollection;
    } else if (dir =="listings"){
    } else {
        return res.status(400).send(dir + " Not recognized");
    }
    
    const ObjectId = require('mongodb').ObjectId;
    const listingQuery = {_id : new ObjectId(req.body.id)}

    new Promise((resolve, reject) => {
        con.collection(collection).updateOne(listingQuery, addImage, (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        });
    })
    .then((_) => {
        res.send("success");
    })
    .catch((error) => {
        res.status(400).send("error uploading image");
    })
});
 
//This is just to testing stuff
app.get('/', (req, res) => {
    //res.redirect("http://localhost:3000/");
    //res.send("Hey");
    res.redirect("http://localhost:3000/register");
});

app.get('/image/:directory/:listingID/:filename', (req, res) => {
    const { directory, listingID, filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'uploads/' + directory + '/' + listingID + '/'+ filename);
    return res.sendFile(fullfilepath);
});

app.get('/bookstore/branding/:bookstoreID', (req,res) => {
    const bookstoreID = req.params.bookstoreID;
    const ObjectId = require('mongodb').ObjectId;
    const query = {_id : new ObjectId(bookstoreID)}

    new Promise((resolve, reject) => {
        con.collection(bookstoreCollection).findOne(query, (err, result) => {
            if (err) {reject(err)} else {resolve(result)}
        });
    })
    .then((bookstore) => {
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, 'uploads/branding/' + bookstoreID + '/'+ bookstore.brandingImage);
        return res.sendFile(fullfilepath);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
})

app.use('/', express.static('pages'));


app.listen(PORT, HOST);

console.log('up and running');
