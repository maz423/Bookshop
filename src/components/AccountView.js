import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './ListingView.css';

function AccountView(){
    
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    useEffect(() => {
        const userURL = 'http://localhost:8000/user';
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(userURL, requestOptions)
        .then((response) => {
            if (!response.ok){
                navigate("/");
            }
            else {
                return response.json();
            }
        })
        .then((data) => {
            console.log(data);
            setUsername(data.username);
            setAddress1(data.address1);
            setAddress2(data.address2);
        })
        .catch((error) => {
            console.log(error);
        });
    });

    return (
        <div className = "mainContainer">
            <h1>{username}</h1>
            <h1>{address1}</h1>
            <h1>{address2}</h1>
        </div>
    )
}
export default AccountView;