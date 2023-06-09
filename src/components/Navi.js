
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
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';





export const Navi = (props) => {


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [keywordFromHomepage, setKeywordFromHomepage] = useState("");

    const navigate = useNavigate();
        

return (
    <div>
    
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Container fluid>
    
    <Navbar.Brand className='logo' ><h1 className='txt'>Bookshop</h1></Navbar.Brand>
    
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      
      <Nav.Link as={Link} to='/'>Home</Nav.Link>
      <Nav.Link as={Link} to="/Login">Login</Nav.Link>
      <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
      <Nav.Link as={Link} to='/registerBookStore'>Bookstore Signup </Nav.Link>
       
        
        
      </Nav>
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
          onKeyPress={event => {
            if (event.key === "Enter") {
              // <Link to={`/search/${keywordFromHomepage}`}></Link>
              navigate(`/search/${keywordFromHomepage}`)
            }
          }}
          
        />
        <Button as={Link} to={`/search/${keywordFromHomepage}`}variant="outline-success" disabled={!keywordFromHomepage}>Search</Button>
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

  </div>
  

  

    


   

 











);


}