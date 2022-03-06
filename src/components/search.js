
import './Login.css';
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Container } from 'react-bootstrap';



import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const Search = (props) => {

const [keyword, setKeyword] = useState('');


const handleSubmitClick = (e) => {

       e.preventDefault();

       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({keyword : e.target.keyword.value})
       };

       fetch('http://localhost:8000/regularSearch', requestOptions)
       .then((response) => {
              console.log(response);
       })
       .catch((error) => {
              console.log(error);
       });


}
   



return (
<div className='Search'>
       
       <Link to="/advancedSearch"> <Button variant="link" size="sm" className="advancedSearch"> Advanced Search </Button></Link>
      
      
       <form className='form' onSubmit={handleSubmitClick}>

              <label for="keyword">Search for a book by title:</label>
              <input type="text" id="keyword" value={keyword} onChange={(e)=>setKeyword(e.target.value)} name="keyword"></input>

              <Button variant="success" size="sm" type="submit">Search</Button>

       </form>       
       
       
       
</div>
      

);


}