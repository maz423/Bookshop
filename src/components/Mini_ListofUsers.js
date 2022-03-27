import './Mini_ListofUsers.css'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserView } from './UserView';

export const Mini_ListofUsers = (props) => {
    const [userList, setUserList] = useState([]);



    //Component mount and unmount
    useEffect(() => {
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };
        
        fetch('http://localhost:8000/users', requestOptions)
        .then((response) => {
          if (!response.ok){
            console.log("error geting users");
          } else {
            return response.json();
          }
        })
        .then((data) => {
            console.log(data);
            setUserList(data);
        })
        .catch( (error)=>{
            console.log(error);
        });
    },[]);
    //component Updata
    // useEffect(() => {
    //     if (props.users != ""){
    //         setUserList(props.users);
    //     } else {
    //         setUserList([]);
    //     }
    // },[props.users]);

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