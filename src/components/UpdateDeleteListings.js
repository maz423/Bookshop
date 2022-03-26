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
import { ListOfListings } from './ListOfListings';




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const UpdateDeleteListings = (props) => {

const [keyword, setKeyword] = useState('');
const [subject, setSubject] = useState('');
const [price, setPrice] = useState('');
const [author, setAuthor] = useState('');
const [location, setLocation] = useState('');
const [ value, setValue ] = useState(0);



const [title, setTitle] = useState('');
const [listingID, setListingID] = useState('');
const [listingsList, setListingsList] = useState([]);




const handleSubmitClick = (e) => {

       

}


   



return (
<div className='update-Delete-listings'>
<Button  variant="danger" size='sm' className='offer-btn' type="submit"  >Delete Listing</Button> 
<Button  variant="success" size='sm' className='offer-btn' type="submit"  >Update Listing</Button>  
       
</div>
      

);


}