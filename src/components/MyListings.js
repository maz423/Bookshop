import React from 'react';
import {faCode} from "react-icons/fa";
import { ListOfListings } from './ListOfListings';
import { useState } from 'react';




function MyListings (props){
    const [Listings,setListings] = useState('')

    //grab listings of user.
    if (props.bookstore == 1 && props.user == 0){ //grab Listings posted by Bookstore 

    }
    else{ //grab listings from user

    }

    return (
        <div><h1> Users/Bookstores Listings will be shown here</h1>
        <ListOfListings listings = {Listings} MyListings = {1}/></div>
    )
}


export default MyListings;