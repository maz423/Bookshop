
import './Navi.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';


 
 
 
 
 
   
   
 
 
 
 
 export const DropdownUser = (props) => {
 
 const handleSubmitClick = (e) => { //handle submit event.
 
     }
         
 
 return (
 
      <div className='dropdown'>

      <Dropdown>
        <Dropdown.Toggle  variant="success" id="dropdown-basic">

        <img
        src="https://cdn-icons-png.flaticon.com/512/61/61135.png"
        width="20"
        height="20"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
        
      />
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Update Profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Favourites</Dropdown.Item>
        <Dropdown.Item href="#/action-3">View Posted Listings</Dropdown.Item>
        <Dropdown.Item href="#/action-4">Log out</Dropdown.Item>
        
        </Dropdown.Menu>
        </Dropdown>
      </div> 
     
     
       
 );

 }