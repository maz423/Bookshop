import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import './ListingView.css'

function ListingView(){

    const {listingID} = useParams();
    const [bookName, setBookName] = useState('');
    const [bookDescription, setBookDescription] = useState('');


    useEffect(() => {
        const listingURL = 'http://localhost:8000/listing/' + listingID;
        console.log(listingURL);
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(listingURL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            console.log(data);
            setBookName(data.name);
        })
        .catch((error) =>{
            console.log(error);
        });
    });

    return (
        <div className = "mainContainer">
            <h1>{bookName}</h1>
        </div>
    )
}

export default ListingView;