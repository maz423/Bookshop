import './Report.css';
import React from 'react';
import {useState} from 'react';
import { useEffect } from 'react';
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
import Row from 'react-bootstrap/Row'




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const Report = (props) => {

const [resolve, setResolve] = useState(0);
const [username, setUsername] = useState('');
const [reason, setReason] = useState('');
const [comments, setComments] = useState('');

const [keyword, setKeyword] = useState('');
const [subject, setSubject] = useState('');
const [price, setPrice] = useState('');
const [author, setAuthor] = useState('');
const [location, setLocation] = useState('');
const [ value, setValue ] = useState(0);




const [title, setTitle] = useState('');
const [listingID, setListingID] = useState('');
const [listingsList, setListingsList] = useState([]);


useEffect(() => {
       setUsername(props.report.username);
       setReason(props.report.reason);
}, []);


const handleResolve = (e) => {
       setResolve(1);
       e.preventDefault();


       const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify({username : username})
            }
      
            fetch('http://localhost:8000/resolveReport', requestOptions)
             .then((response) => {
                    
                    if(response.ok){
                        console.log("ok");
                    }
                    else{
      
                    }
             })
             .catch((error) => {
                    console.log(error);
             });

       
}


   



return (

<div className='Report'>

<Container fluid>
       <Row>

       <p> Username: {username} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Reason: {reason}</p>

       </Row>


       </Container>

       <div className='btn-report'>
        {resolve == 0
        ? <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleResolve} > Resolve</Button>
        :

           
       <Button  variant="success" size='sm' className='offer-btn' type="submit" onClick={handleResolve} > Resolved</Button>}
       </div>
       
</div>

      

);


}