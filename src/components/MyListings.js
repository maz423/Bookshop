import React from 'react';
import {faCode} from "react-icons/fa";
import { ListOfListings } from './ListOfListings';
import { useState,useEffect } from 'react';
import {NoResult} from './NoResult'




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

        <section>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
        {Listings.length == 0
  
         ? <NoResult/>
         :<></>
          }
            
        <ListOfListings listings = {Listings} MyListings = {1}/>
        
        
        </div>

      <h1 className='end-search'> &nbsp;</h1>
      <p className='end'>End of Listings</p>
      <h1 className='end-search'> &nbsp;</h1>

       </section> 
    )
}


export default MyListings;
