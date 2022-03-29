import './NoResult.css';
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

export const NoResult = (props) => {


   



return (

<div className='no-result'>
       <p>&nbsp;</p>
       <p className='nr'> &nbsp;&nbsp;&nbsp;&nbsp; Nothing to show ! &nbsp;&nbsp;&nbsp;</p>
       <p>&nbsp;</p>
</div>

      

);


}