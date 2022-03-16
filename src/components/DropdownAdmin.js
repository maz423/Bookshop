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


 
 
 
 
 
   
   
 
 
 
 
 export const DropdownAdmin = (props) => {
 
 const handleSubmitClick = (e) => { //handle submit event.
 
     }
         
 
 return (
 
    <div className='dropdown'>

      <Dropdown>
        <Dropdown.Toggle  variant="success" id="dropdown-basic">

        <img
        src="data:image/png;base64,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"
        width="20"
        height="20"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
        
      />
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item as={Link} to="#/action-1">Search User</Dropdown.Item>
        <Dropdown.Item as={Link} to="#/action-2">View Reports</Dropdown.Item>
        <Dropdown.Item as={Link} to="#/action-3">View website metrics</Dropdown.Item>
        <Dropdown.Item as={Link} to="/logout">Log out</Dropdown.Item>
        
        </Dropdown.Menu>
        </Dropdown>
      </div> 

     
     
       
 );

 }