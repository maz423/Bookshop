import React,{useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { ListOfListings } from './ListOfListings';

export const BookstoreView = () => {
    const {bookstoreID} = useParams();
    const [listings, setListings] = useState([]);
    const [bookstoreName, setBookstoreName] = useState('');
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
            const URL2 = `http://localhost:8000/bookstore/${bookstoreID}`;
            fetch(URL2, requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                }
            })
            .then((data) => {
                setBookstoreName(data.companyName);
            })
            .catch((error) =>{
                console.log(error);
            });
        })
        .catch((error) =>{
            console.log(error);
        });

        
    }, []);

    return (
        <div>
            <h2>{bookstoreName}'s Books</h2>
            <ListOfListings listings={listings}></ListOfListings>
        </div>
    )
}
