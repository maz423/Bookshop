
import './Search.css';
import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import ReactDOM from 'react-dom';



import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const Search = (props) => {

const {keywordFromHomepage} = useParams();

const [keyword, setKeyword] = useState('');

const [title, setTitle] = useState('');
const [listingID, setListingID] = useState('');

const listing = (
       <div>

          <Button className='searchResult' variant="success" href={`/listing/${listingID}`}>{title}</Button>

       </div>
   )

const message = (
       <div>
              <h1 className='message'>Sorry, we couldn't find any listings that matched that search term.</h1>
       </div>
)



useEffect(() => {
       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({keyword : keywordFromHomepage})
       };

       fetch('http://localhost:8000/regularSearch', requestOptions)
       .then((response) => {
              
              if(response.ok){
                     return response.json();
              }
              else{

              }
       })
       .then((data) => {

              if(data.length == 0){
                     ReactDOM.render(message, document.getElementById('listings'));
              }
              else{
                     for(const result of data){
                            console.log(result);
                            setTitle(result.title[0]);
                            setListingID(result._id);
                            ReactDOM.render(listing, document.getElementById('listings'));
                     }
              }
       })
       .catch((error) => {
              console.log(error);
       });

})




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
              
              if(response.ok){
                     return response.json();
              }
              else{

              }
       })
       .then((data) => {

              if(data.length == 0){
                     ReactDOM.render(message, document.getElementById('listings'));
              }
              else{
                     for(const result of data){
                            console.log(result);
                            setTitle(result.title[0]);
                            setListingID(result._id);
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
       
       <Link to="/advancedSearch"> <Button variant="link" size="sm" className="advancedSearch"> Advanced Search </Button></Link>
      
      
       <form className='form' onSubmit={handleSubmitClick}>

              <label for="keyword">Search for a book by title:</label>
              <input type="text" id="keyword" value={keyword} onChange={(e)=>setKeyword(e.target.value)} name="keyword"></input>

              <Button variant="success" size="sm" type="submit">Search</Button>

       </form>       
       
       <div className='listings' id="listings">
           
           </div>
       
</div>


      

);


}