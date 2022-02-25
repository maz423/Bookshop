
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




export const Navi = (props) => {

const handleSubmitClick = (e) => { //handle submit event.

    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
        

return (


    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container fluid>
    {/* <div className='logobox'>
    <h1 className='logo'>Bookshop</h1>
    </div>   */}
    
    {/* <Nav.Item className="ml-auto">
      <Nav.Link>Hi fname lname!</Nav.Link>
    </Nav.Item> */}
    <Navbar.Brand className='logo' ><h1 className='txt'>Bookshop</h1></Navbar.Brand>
    
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
       <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/Login">Login</Nav.Link>
        <Nav.Link href="/signup">Signup</Nav.Link>
        {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown> */}
      </Nav>
      <Nav>
        {/* <Nav.Link href="#deets">More deets</Nav.Link> */}
        <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search for Books"
          className="me-2"
          aria-label="Search"
          size='sm'
        />
        <Button variant="outline-success">Search</Button>
      </Form>
        <Nav.Link eventKey={2} href="#memes" onClick={handleShow}>
          Contact us
        </Nav.Link>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact information</Modal.Title>
        </Modal.Header>
        <Modal.Body> Email: bookStoreSask@gmail.com<br></br>
                     phone: +1 3061234567<br></br>
                     Fax: +1 3061234568
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
      
      </Nav>
    </Navbar.Collapse>
    </Container>
  </Navbar>

  

    


   

 











);


}