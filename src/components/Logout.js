import "./Logout.css"
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import React,{useEffect, useState} from 'react';

function Logout(props){

    const navigate = useNavigate();

    useEffect(() => {
    
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
          };
          const URL = 'http://localhost:8000/logout';

          fetch(URL, requestOptions)
          .then((response) => {
              if (!response.ok){
                  alert("Error logging out")
              } else {
                  //TODO Clear logged in property here
                  navigate('/');
                  alert("Logged out");
                  props.set(0);
                  props.admin(0);
                  
                  props.bookstore(0);
                 
              }
          })
          .catch((error) => {
              alert(error);
          })

        }, []);   
    

    return (

        <h1></h1>
        // <div>
        //     <Button onClick={handleLogout}>Logout</Button>
        // </div>
    )
}

export default Logout;