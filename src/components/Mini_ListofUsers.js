import './Mini_ListofUsers.css'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MiniListingView } from './MiniListingView';

export const Mini_ListofUsers = (props) => {
    const [usersList, setUsersList] = useState([]);



    //Component mount and unmount
    useEffect(() => {
        setUsersList([]);
    }, []);
    //component Updata
    useEffect(() => {
        if (props.users != ""){
            setUsersList(props.users);
        } else {
            setUsersList([]);
        }
    },[props.users]);

    return(
        <div className='Mini-user'>
            
            <p className='user-info' user-info> <img src='https://secondchancetinyhomes.org/wp-content/uploads/2016/09/empty-profile.png' alt="..." width="100" height="100" class="img-thumbnail"  />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User ID :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   First Name :    &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Last Name :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Date joined :</p> 
            
        </div>
    )
}