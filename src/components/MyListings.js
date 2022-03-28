import React from 'react';
import {faCode} from "react-icons/fa";
import { ListOfListings } from './ListOfListings';
import { useState,useEffect } from 'react';




function MyListings (props){
    const [Listings,setListings] = useState('')


    useEffect(() => {
        //Get the listings That I posted for the server
        const listingsURL = 'http://localhost:8000/user/my/listings';
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(listingsURL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert("Error getting listings");
            }
        })
        .then((listings) => {
            setListings(listings);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])
    //grab listings of user.
    if (props.bookstore == 1 && props.user == 0){ //grab Listings posted by Bookstore 

    }
    else{ //grab listings from user

    }

    return (
        <div>
        <ListOfListings listings = {Listings} MyListings = {1}/></div>
    )
}


export default MyListings;