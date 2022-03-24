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
import { LinkContainer } from 'react-router-bootstrap'

 
 
 
 
 
   
   
 
 
 
 
 export const DropdownBookstore = (props) => {
 
 const handleSubmitClick = (e) => { //handle submit event.
 
     }
         
 
 return (
 
      <div className='dropdown'>

      <Dropdown>
        <Dropdown.Toggle  variant="success" id="dropdown-basic">

        <img
        src="https://thumbs.dreamstime.com/b/store-icon-vector-isolated-white-background-logo-concept-store-sign-transparent-background-filled-black-symbol-store-icon-125790318.jpg"
        width="30"
        height="25"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
        
        
      />
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item as={Link} to="#/action-4">Manage Listings</Dropdown.Item>
        
        <Dropdown.Item as={Link} to='/wishlist'>Books sold</Dropdown.Item>

        <Dropdown.Item as={Link} to='/wishlist'> Availible Books </Dropdown.Item>
        
        <Dropdown.Item as={Link} to='/createlisting'> Create new Listing</Dropdown.Item>

        <Dropdown.Item as={Link} to="/report">Report User</Dropdown.Item>
        
        
        <Dropdown.Item as={Link} to='/logout'>Log out</Dropdown.Item>
        
        </Dropdown.Menu>
        </Dropdown>
      </div> 
     
     
       
 );

 }