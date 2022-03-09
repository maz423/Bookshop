import './Search.css';
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

export const AdvancedSearch = (props) => {

const [keyword, setKeyword] = useState('');
const [subject, setSubject] = useState('');
const [price, setPrice] = useState('');
const [author, setAuthor] = useState('');
const [location, setLocation] = useState('');


const handleSubmitClick = (e) => {

       e.preventDefault();

       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({keyword : e.target.keyword.value, subject : e.target.subject.value, price : e.target.price.value, author : e.target.author.value,
                location : e.target.location.value})
       };

       fetch('http://localhost:8000/advancedSearch', requestOptions)
       .then((response) => {
              console.log(response);
       })
       .catch((error) => {
              console.log(error);
       });


}
   



return (
<div className='Search'>
       
       <Link to="/search"> <Button variant="link" size="sm" className="regularSearch"> Regular Search </Button></Link>
      
      
       <form className='form' onSubmit={handleSubmitClick}>

              <label for="keyword">Title:</label>
              <input type="text" id="keyword" value={keyword} onChange={(e)=>setKeyword(e.target.value)} name="keyword"></input>
              <label for="subject">Subject:</label>
              <input type="text" id="subject" value={subject} onChange={(e)=>setSubject(e.target.value)} name="subject"></input>
              <label for="price">Price:</label>
              <input type="text" id="price" value={price} onChange={(e)=>setPrice(e.target.value)} name="price"></input>
              <label for="author">Author:</label>
              <input type="text" id="author" value={author} onChange={(e)=>setAuthor(e.target.value)} name="author"></input>
              <label for="location">Location:</label>
              <input type="text" id="location" value={location} onChange={(e)=>setLocation(e.target.value)} name="location"></input>

              <Button variant="success" size="sm" type="submit">Search</Button>

       </form>       
       
       
       
</div>
      

);


}