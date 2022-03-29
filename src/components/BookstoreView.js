import React,{useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { ListOfListings } from './ListOfListings';

export const BookstoreView = () => {
    const {bookstoreID} = useParams();
    const [listings, setListings] = useState([]);
    useEffect(() => {
        const URL = `http://localhost:8000/bookstore/listings/${bookstoreID}`;
        
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };
        fetch(URL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            setListings(data);
        })
        .catch((error) =>{
            console.log(error);
        });
    }, []);

    return (
        <div>
            <ListOfListings listings={listings}></ListOfListings>
        </div>
    )
}
