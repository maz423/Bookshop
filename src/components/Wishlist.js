import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ListOfListings } from './ListOfListings';
import { NoResult } from './NoResult';


export const Wishlist = (props) => {

    const {userID} = useParams();

    const [wishlist, setWishlist] = useState([]);


useEffect(() => {

    const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({id : userID})
    };

    fetch('http://localhost:8000/wishlist', requestOptions)
    .then((response) => {

        if(response.ok){
            return response.json();
        }
        else{

        }

    })
    .then((data) => {
        setWishlist(data);
    })
    .catch((error) => {
        console.log(error);
    })


}, []);


return (

<section className='wishlist-display'>
{wishlist.length == 0
  
  ? <NoResult/>
  :<></>
  }
<ListOfListings listings={wishlist} wish = {1}/>
</section>


);


}