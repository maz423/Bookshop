import './Report.css';
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

export const Report = (props) => {

const [resolve, setResolve] = useState(0);

const [keyword, setKeyword] = useState('');
const [subject, setSubject] = useState('');
const [price, setPrice] = useState('');
const [author, setAuthor] = useState('');
const [location, setLocation] = useState('');
const [ value, setValue ] = useState(0);




const [title, setTitle] = useState('');
const [listingID, setListingID] = useState('');
const [listingsList, setListingsList] = useState([]);




const handleResolve = (e) => {
       setResolve(1);
       e.preventDefault();

       
}


   



return (

<div className='Report'>
       <p>&nbsp;&nbsp;</p>
       <p className='report-para'> &nbsp;&nbsp;&nbsp;&nbsp;Username : John Doe   &nbsp;&nbsp;&nbsp;&nbsp;  Reason for Report : Spam    &nbsp;&nbsp;&nbsp;&nbsp;</p>
       <p>&nbsp;&nbsp;&nbsp;&nbsp;Report Date: </p>
       <p> &nbsp;&nbsp;&nbsp;&nbsp;Comments : User is not responding and posting spam ads.&nbsp;&nbsp;&nbsp;&nbsp;</p>

       <div className='btn-report'>
        {resolve == 0
        ? <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleResolve} > Resolve</Button>
        :

           
       <Button  variant="success" size='sm' className='offer-btn' type="submit" onClick={handleResolve} > Resolved</Button>}
       </div>
       
</div>

      

);


}