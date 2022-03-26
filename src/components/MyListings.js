import React from 'react';
import {faCode} from "react-icons/fa";
import { ListOfListings } from './ListOfListings';
import { useState } from 'react';


//grab listings of user.

function MyListings (){
    const [Listings,setListings] = useState('')

    return (
        <div><h1> Users/Bookstores Listings will be shown here</h1>
        <ListOfListings listings = {Listings} MyListings = {1}/></div>
    )
}


export default MyListings;