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
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import RangeSlider from 'react-bootstrap-range-slider';
import ReactDOM from 'react-dom';




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const AdvancedSearch = (props) => {

const [keyword, setKeyword] = useState('');
const [subject, setSubject] = useState('');
const [price, setPrice] = useState('');
const [author, setAuthor] = useState('');
const [location, setLocation] = useState('');
const [ value, setValue ] = useState(0);



const [title, setTitle] = useState('');
const [listingAddress, setListingAddress] = useState('');

const listing = (
       <div>
           <h1 className='listingTitle'>{title}</h1>
       </div>
   )

const message = (
       <div>
              <h1 className='message'>Sorry, we couldn't find any listings that matched that search term.</h1>
       </div>
)


const handleSubmitClick = (e) => {

       e.preventDefault();

       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({keyword : e.target.keyword.value, 
                     subject : e.target.subject.value, 
                     value : e.target.value.value, 
                     author : e.target.author.value,
                location : e.target.location.value})
       };

       fetch('http://localhost:8000/advancedSearch', requestOptions)
       .then((response) => {
              
              if(response.ok){
                     return response.json();
              }
              else{

              }
       })
       .then((data) => {
              //console.log(data);
              if(data.length == 0){
                     ReactDOM.render(message, document.getElementById('listings'));
              }
              else{
                     for(const result of data){
                            setTitle(result._id);
                            ReactDOM.render(listing, document.getElementById('listings'));
                     }
              }
       })
       .catch((error) => {
              console.log(error);
       });


}


   



return (
<div className='Search'>
       
       {/* <Link to="/search"> <Button variant="link" size="sm" className="regularSearch"> Regular Search </Button></Link> */}
      
       <h1 className='Adv-search'> Use the following filters for Advanced Search:</h1>
       <form className='form' onSubmit={handleSubmitClick}>

          &nbsp;&nbsp;
          &nbsp;&nbsp;
             <label for="keyword">Title:</label>&nbsp;&nbsp;
              <input type="text" id="keyword" value={keyword} onChange={(e)=>setKeyword(e.target.value)} name="keyword"></input>&nbsp;&nbsp;&nbsp;&nbsp;
              <label for="subject">Subject:</label>&nbsp;&nbsp;
              <input type="text" id="subject" value={subject} onChange={(e)=>setSubject(e.target.value)} name="subject"></input>&nbsp;&nbsp;&nbsp;&nbsp;
              <label for="author">Author:</label>&nbsp;&nbsp;
              <input type="text" id="author" value={author} onChange={(e)=>setAuthor(e.target.value)} name="author"></input>&nbsp;&nbsp;&nbsp;&nbsp;


              <label for="location">Location:</label>&nbsp;&nbsp;
              <input type="text" id="location" value={location} onChange={(e)=>setLocation(e.target.value)} name="location"></input> &nbsp;&nbsp;&nbsp;&nbsp;
             <br></br><br></br>
              <p>Price range:</p>
              <RangeSlider
              value={value}
              min={1}
              max={500}
              tooltipLabel={currentValue => `${currentValue}$`}
              tooltip='on'
              onChange={(e) => setValue(e.target.value)}
              
              /><br></br>
              
              
    
              
              <Button variant="success" size="sm" type="submit">Advanced Search</Button>

       </form>     

       <div className='listings' id="listings">
           
           </div>  
       
</div>
      

);


}