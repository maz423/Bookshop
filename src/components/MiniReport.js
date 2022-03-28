import './Report.css';
import React, { useEffect } from 'react';
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
import Row from 'react-bootstrap/Row'
import { Popover } from 'react-bootstrap';




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const MiniReport = (props) => {

const [username, setUsername] = useState('');
const [reason, setReason] = useState('');





const handleResolve = (e) => {
       

       
}


useEffect(() => {
       setUsername(props.report.username);
       setReason(props.report.reason);
}, []);


   



return (

<div className='Report'>
       {/* <p> Username :     &nbsp;&nbsp;&nbsp;   Date of Report:</p> */}

       <Container fluid>
       <Row>

       <p> Username: {username} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Reason: {reason}</p>

       </Row>


       </Container>
       
</div>

      

);


}