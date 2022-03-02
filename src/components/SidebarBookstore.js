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
import { Offcanvas } from 'react-bootstrap';
import { render } from '@testing-library/react';





export const SidebarBookstore = (props) => {

  const [show, setShow] = useState(false);
    
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



    
  return (
        <div>
          <Button variant="outline-success" onClick={handleShow}>
            Registered bookstores
          </Button>
          
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Active Bookstores:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              Some text as placeholder. In real life you can have the elements you
              have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
            
          </Offcanvas>
        </div>
      );

}
    
    
   
   

    
   
   
