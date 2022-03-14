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
import { DropdownAdmin } from './DropdownAdmin';
import { DropdownUser } from './DropdownUser';
import { LinkContainer } from 'react-router-bootstrap'




export const Login_Nav = (props) => {

const handleSubmitClick = (e) => { //handle submit event.


  // e.preventDefault();

  // const requestOptions = {
  //        credentials: 'include',
  //        method: 'POST',
  //        headers: {'Content-Type' : 'application/json'},
  //        body : JSON.stringify({keyword : e.target.keyword.value})
  // };

  // fetch('http://localhost:8000/regularSearch', requestOptions)
  // .then((response) => {
  //        // console.log(response);
  //        console.log(JSON.stringify(response));
  // })
  // .catch((error) => {
  //        console.log(error);
  // });

}
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const Admin = props.admin;

    const [keywordFromHomepage, setKeywordFromHomepage] = useState("");
        

return (


    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container fluid>
    
    <Navbar.Brand className='logo' ><h1 className='txt'>Bookshop</h1></Navbar.Brand>
    
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      <LinkContainer to="/">
      <Nav.Link>Home</Nav.Link>
      </LinkContainer>
        
        
      </Nav>
      
    {!Admin
    ?   <DropdownUser/>
    :  <DropdownAdmin/>
    
    }


    

      <Nav>
        
        <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search for Books"
          className="me-2"
          aria-label="Search"
          size='sm'
          value={keywordFromHomepage}
          onChange={(e)=>setKeywordFromHomepage(e.target.value)}
        />
        <Button variant="outline-success" onClick={handleSubmitClick} href={`/search/:${keywordFromHomepage}`}>Search</Button>
      </Form>
        <Nav.Link as={Link} to="/advancedsearch">Advanced Search</Nav.Link>
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