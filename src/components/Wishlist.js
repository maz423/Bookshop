import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { ListOfListings } from './ListOfListings';


export const Wislist = (props) => {

    const {userID} = useParams();

    const [wishlist, setWishlist] = useState('');
    const [listingID, setListingID] = useState('');
    const [title, setTitle] = useState('');

    // const listing = (
    //     <div>
    //         <Button className='wishlistItem' variant="success" href={`/listing/${listingID}`}>{title}</Button>
    //     </div>
    // )


useEffect(() => {

    const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({id : userID})
    };

    fetch('http://localhost:8000/user/wishlist', requestOptions)
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


})


return (

<div className="Wishlist">

    <ListOfListings listings={wishlist}></ListOfListings>

</div>


);


}