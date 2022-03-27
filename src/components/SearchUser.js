import './Search.css';
import React, { useEffect } from 'react';
import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { Mini_ListofUsers } from './Mini_ListofUsers';

export const SearchUser = (props) => {
const [keyword, setKeyword] = useState('');
const [usersList, setUsersList] = useState([]);



const handleSubmitClick = (e) => {
       e.preventDefault();
       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({keyword : keyword})
       }

       fetch('http://localhost:8000/searchUser', requestOptions)
       .then((response) => {
              if(response.ok){
                     return response.json();
              }
              else{
                     alert(response);
              }
       })
       .then((data) => {
              setUsersList(data);
       })
       .catch((error) => {
              console.log(error);
       })

}


return (
<div className='SearchUser'>
   
<Form className="d-flex" onSubmit={handleSubmitClick}>
        <Form.Control
          type="search"
          placeholder="Search User"
          className="me-2"
          aria-label="Search"
          size='sm'
          value={keyword}
          onChange={(e)=>setKeyword(e.target.value)}
          
        />
        <Button type="submit" variant="success" size='md' disabled={!keyword}>Search User</Button>
      </Form>

       <Mini_ListofUsers users={usersList} />

      </div>
);


}