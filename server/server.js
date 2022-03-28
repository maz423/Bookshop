'use strict';

// load package
const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require("bcryptjs");
const path = require('path');
const bodyParser = require("body-parser");
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const fs = require('fs-extra');
const multerHelper = require(path.join(__dirname, "multerHelper"));
const jsonexport = require('jsonexport')

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
const bannedUsersCollection = "bannedUsers";
const reportsCollection = "reports";

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
        //First check if user is banned
        const bannedQuery = {accountName : username}
        con.collection(bannedUsersCollection).countDocuments(bannedQuery, (err, result) => {
            if (err) { reject(err) } else {resolve(result)}
        });
    })
    .then((count) => {
        //Check if username was found in banned users
        if (count > 0){
            throw `User: ${username} is banned`;
        }
    })
    .then(() => {
        //Query the database with the provided values
        new Promise((resolve, reject) => {
            con.collection(collection).findOne(query, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        })
        .then((user) => {
            if (user == null) {
                throw `User: "${username}" not found`;
            }
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
                console.log(error);
                res.status(400).send(error);
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
                accountType : "User",
                isBanned : false,
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
                accountType : "Bookstore",
                isBanned : false,
                profilePicture : "",
                brandingImage : "",
                booksSold : [],
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
    const projection ={
        projection:{
            password : 0
        }
    }
    new Promise((resolve, reject) => {
        con.collection(userCollection).find({}, projection).toArray((err, result) =>{
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

app.get('/bookstore/:bookstoreID', (res, req) => {
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
                console.log(error);
                res.status(400).send(error);
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
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        let searchResults = await performSearch();
        console.log(searchResults[0]);
        res.send(searchResults);
    })();
});


app.post('/searchUser', (req, res) => {

    let keyword = req.body.keyword;

    const pipeline = [
        { $match: { username: { $regex: keyword, $options: "i"} } },
        { $project: {username: 1, email: 1, fName: 1, lName: 1, accountType: 1}}
    ];

    async function performSearch(){
        try{
            const users = await con.collection(userCollection);
            const aggCursor = await users.aggregate(pipeline);
            return aggCursor.toArray();

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        let searchResults = await performSearch();
        res.send(searchResults);
    })();


})

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
        //Add new listing to the database
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

//Deletes a listing and its images
app.delete('/remove-lis',(req, res)=>{
    //Get ID from request
	const listingID = req.body.listingID;
    const ObjectId = require('mongodb').ObjectId;
    const query =  {_id : new ObjectId(listingID)};

    //Delete listing from database
    con.collection(listingsCollection).deleteOne(query)
    .then((result) => {
        const dir = `uploads/listings/${listingID}`
        //Now that we removed it from our fatabase, remove images from server
        fs.remove(dir, (err) => {
            if (err) {res.status(400).send(err)} else {res.send(result)}
        })
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});

//This is for a bookstore to "sell" it's book
//This will both delete the listing and it's images
//And add information about the sold book to the bookstore's entry in the database
app.delete('/bookstore/sell/listing', (req, res) => {
    //First check if we are a bookstore
    if (!req.session.user.isBookstore){
        return res.status(400).send("Not a Bookstore");
    }

    //Get ID from request
	const {listingID, finalPrice} = req.body;
    const ObjectId = require('mongodb').ObjectId;
    const query =  {_id : new ObjectId(listingID)};

    //Now find and delete the listing
    con.collection(listingsCollection).findOneAndDelete(query)
    .then((listing) => {
        if (listing == null) {
            throw `Listing: "${listingID}" not found`
        } else {
            //We have found the listing we want to delete
            const dir = `uploads/listings/${listingID}`

            //Now that we removed it from our fatabase, remove images from server
            fs.removeSync(dir);
            return listing
        }
    })
    .then((listing) => {
        //Push book info into bookstore storage
        const datetime = new Date()
        const bookSold = {
            $push : {
                booksSold : {
                    initialPrice : listing.value.price,
                    finalPrice : finalPrice,
                    title : listing.value.title,
                    dateListed : listing.value.timestamp,
                    dateSold : datetime,
                }
            }
        }
        const query = {_id : req.session.user._id};

        //Now add it to the bookstore's account
        con.collection(bookstoreCollection).updateOne(query, bookSold, (err, result) => {
            if (err) {throw err} else {return res.send("Sold Book")}
        });
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});

app.get('/bookstore/sales/report', (req, res) => {
    //First check if we are a bookstore
    if (!req.session.user.isBookstore){
        return res.status(400).send("Not a Bookstore");
    }

    //Get the sale reports from the bookstore
    const query = {_id : req.session.user._id};
    const projection = {
        projection : {
            booksSold : 1,
        }
    }

    con.collection(bookstoreCollection).findOne(query, projection)
    .then((data) => {
        let csvData = [];
        //Get all the data from the books sold
        data.booksSold.forEach((listing) => {
            let listingData = {
                title : listing.title,
                initialPrice : listing.initialPrice,
                finalPrice : listing.finalPrice,
                dateListed : listing.dateListed,
                dateSold : listing.dateSold,
            }
            csvData.push(listingData);
        });
        
        jsonexport(csvData, (err, csv) => {
            if (err) {return res.status(400).send(err);}
            else {
                res.attachment('sales.csv');
                return res.send(csv);
            }
        })
    })
    .catch((error => {
        res.status(400).send(error);
    }))
});

//This is for updating listing, you can update by button press (needs to be implemented by john), TODO make the old data autofill also put errors for when there isn't any items in the form
app.put('/update_lis', (req,res)=>{
    //Get the values from the request
	const {listingID, title, authorName, description, price, address1, address2, city, province, zipCode} = req.body;
    const ObjectId = require('mongodb').ObjectId;

    //Set the update stuff
    const listingUpdate = {
        $set : {
            title: title,
            authorName : authorName,
            description: description,
            price : price,
            address1 : address1,
            address2 : address2,
            city : city,
            province : province,
            zipCode : zipCode,
        }
    }
	const query = {_id : new ObjectId(listingID)};

    con.collection(listingsCollection).updateOne(query, listingUpdate)
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        res.status(400).send(`Error updating listing: ${listingID}`);
    });
});



//See the listings on the browser 
app.get('/listings', (req,res) => {
	//console.log("here")
    new Promise((resolve, reject) => {
        con.collection(listingsCollection).find({}).toArray((err,result) => {
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
//Handles both user and bookstore
app.get('/user/my/listings', (req, res) => {
    const query = {_id : req.session.user._id};
    let collection = userCollection;
    const projection = {
        projection : {
            listings : 1
        }
    }

    //Check for the account
    if (req.session.user.isBookstore) {
        collection = bookstoreCollection;
    } else if (!req.session.user.isBasic) {
        return res.status(400).send("Not a user or bookstore");
    }

    new Promise((resolve, reject) => {
        con.collection(collection).findOne(query, projection,(err, result) => {
            if (err) { reject(err) } else { resolve(result) }
        });
    })
    .then((listings) => {
        //Get all of the listing information
        const listingQuery = {_id : {$in : listings.listings}};
        con.collection(listingsCollection).find(listingQuery).toArray((err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(result);
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
         con.collection(listingsCollection).findOne({_id : listingOID}, (err, result) => {
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
});

app.post('/banUser', (req, res) => {
    //First we only want admins to be able to ban other users or bookstores
    //Also check if we have have a session
    const {accountName, accountID, accountType, accountEmail} = req.body;
    const ObjectId = require('mongodb').ObjectId;

    let collection = userCollection;
    //Check for users that are not already banned
    let query = {_id : new ObjectId(accountID), isBanned : false};
    let update = {$set : {isBanned : true}}
    if (accountType =="Bookstore"){
        collection = bookstoreCollection;
    } else if (accountType != "User"){
        return res.status(400).send(`Unknown account type: "${accountType}"`);
    }

    if (!req.session.user) {
        res.status(400).send("Not logged in");
    } else if (!req.session.user.isAdmin) {
        res.status(400).send("Not an admin");
    } else {
        new Promise((resolve, reject) => {
            const newBannedUser = {
                accountName : accountName,
                accountID : accountID,
                accountType : accountType,
                accountEmail : accountEmail,
            }
            con.collection(bannedUsersCollection).insertOne(newBannedUser, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        })
        .then((result) => {
            //Now we update the correct collection
            con.collection(collection).updateOne(query, update, (err, result) => {
                if (err) {throw err} else {res.send(`Successfully banned ${accountName}`)}
            });  
        })
        .catch((error) => {
            res.status(400).send(error);
        })
    }
});

app.post('/unbanUser', (req, res) => {
    const { accountName, accountID, accountType} = req.body;
    const ObjectId = require('mongodb').ObjectId;

    let collection = userCollection;
    //Check for only banned users
    let query = {_id : new ObjectId(accountID), isBanned : true};
    let update = {$set : {isBanned : false}}

    if (accountType =="Bookstore"){
        collection = bookstoreCollection;
    } else if (accountType != "User"){
        return res.status(400).send(`Unknown account type: "${accountType}"`);
    }

    if (!req.session.user) {
        res.status(400).send("Not logged in");
    } else if (!req.session.user.isAdmin) {
        res.status(400).send("Not an admin");
    } else {
        //We use delete many because it is possible that the same account ID was added multiple times
        const toDelete = {accountID : accountID, accountType: accountType}
        new Promise((resolve, reject) => {
            con.collection(bannedUsersCollection).deleteMany(toDelete, (err, result) => {
                if (err) {reject(err)} else {resolve(result)}
            });
        })
        .then((result) => {
            con.collection(collection).updateOne(query, update, (err, result) => {
                if (err) {throw err} else {res.send(`Successfully unbanned ${accountName}`)}
            });  
        })
        .catch((error) => {
            res.status(400).send(error);
        })
    }
});


app.post('/reportUser', (req, res) => {

    var userID = req.body.userID;
    var user = req.body.username;
    var reason = req.body.reason;


    async function addReport(){

        try{
            const reports = await con.collection(reportsCollection);

            const newReport = {
                userID : userID,
                username : user,
                reason : reason
            }

            await reports.insertOne(newReport)
        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        await addReport();

        res.send("ok");
    })();
});


app.post('/resolveReport', (req, res) => {

    var username = req.body.username;

    async function resolveReport(){
        
        try{
            const reports = await con.collection(reportsCollection);

            await reports.deleteOne({username : username});

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        await resolveReport();            

        res.send("ok");
    })();

})


app.post('/getReports', (req, res) => {

    async function getReports(){
        try{

            let reportArray = [];

            const reports = await con.collection(reportsCollection);

            const the_reports = await reports.find();

            for await (const report of the_reports){
                reportArray.push(report);
            }

            return reportArray;

        }
        catch(error){
            console.log(error);
            res.status(400).send(error);
        }
    };

    (async function() {
        const reports = await getReports();
        res.send(reports);
    })();


})


app.use('/', express.static('pages'));


app.listen(PORT, HOST);

console.log('up and running');
