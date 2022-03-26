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
import { ListOfListings } from './ListOfListings';
import { Link } from 'react-router-dom';











import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { ListingView } from './ListingView';

export const SearchUser = (props) => {

const [keywordFromHomepage, setKeywordFromHomepage] = useState("");
const [keyword, setKeyword] = useState('');

const [title, setTitle] = useState('');
const [listingID, setListingID] = useState('');
const [listingsList, setListingsList] = useState([]);
const navigate = useNavigate();




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



// useEffect(() => {
//        const requestOptions = {
//               credentials: 'include',
//               method: 'POST',
//               headers: {'Content-Type' : 'application/json'},
//               body : JSON.stringify({keyword : keywordFromHomepage})
//        };

//        fetch('http://localhost:8000/regularSearch', requestOptions)
//        .then((response) => {
              
//               if(response.ok){
//                      return response.json();
//               }
//               else{

//               }
//        })
//        .then((data) => {
//               setListingsList(data);
//        })
//        .catch((error) => {
//               console.log(error);
//        });

// }, [keywordFromHomepage])




// const handleSubmitClick = (e) => {

//        e.preventDefault();

//        const requestOptions = {
//               credentials: 'include',
//               method: 'POST',
//               headers: {'Content-Type' : 'application/json'},
//               body : JSON.stringify({keyword : e.target.keyword.value})
//        };

//        fetch('http://localhost:8000/regularSearch', requestOptions)
//        .then((response) => {
              
//               if(response.ok){
//                      return response.json();
//               }
//               else{

//               }
//        })
//        .then((data) => {
//               setListingsList(data);
//               console.log(data)
//        })
//        .catch((error) => {
//               console.log(error);
//        });


// }
   



return (
<div className='SearchUser'>
   
<Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search User"
          className="me-2"
          aria-label="Search"
          size='sm'
          value={keywordFromHomepage}
          onChange={(e)=>setKeywordFromHomepage(e.target.value)}
        //   onKeyPress={event => {
        //     if (event.key === "Enter") {
        //       // <Link to={`/search/${keywordFromHomepage}`}></Link>
        //       navigate(`/search/${keywordFromHomepage}`)
        //     }
        //   }}
          
        />
        <Button as={Link} to={`/search/${keywordFromHomepage}`}variant="success" size='md' disabled={!keywordFromHomepage}>Search</Button>
      </Form>

      <h1 style={{color:'red'}}>Users will be displayed here using Mini_ListofUsers component</h1>

      </div>

 
       
        
       
       
        
       
      



      

);


}