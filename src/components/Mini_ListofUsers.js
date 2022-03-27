import './Mini_ListofUsers.css'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserView } from './UserView';

export const Mini_ListofUsers = (props) => {
    const [userList, setUserList] = useState([]);


    //props.users update
    useEffect(() => {
        if (props.users != ""){
            setUserList(props.users);
        } else {
            setUserList([]);
        }
    },[props.users]);

    return(
        <div className='Mini-user'>
            
            {/* <p className='user-info' user-info> <img src='https://secondchancetinyhomes.org/wp-content/uploads/2016/09/empty-profile.png' alt="..." width="100" height="100" class="img-thumbnail"  />  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;User ID :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   First Name :    &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Last Name :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Date joined :</p>  */}
            {
                userList.map(user => {
                    return <div className="text-center">
                        <UserView user={user}/>
                    </div>
                })
            }
        </div>
    )
}