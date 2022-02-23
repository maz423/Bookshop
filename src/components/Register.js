import './Register.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';


export const Register = (props) => {

const handleSubmitClick = (e) => { //handle submit event.

    }
        

return (

   
<div className="mb-3">

<Form>
  <Row >
   <Form.Group as={Col} controlId="formFirstName">
      <Form.Label>First Name</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Enter First Name" />
    </Form.Group>

    <Form.Group as={Col} controlId="formLastName">
      <Form.Label>Last Name</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Enter Last Name" />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control size='sm' type="email" placeholder="Enter email" />
    </Form.Group>


   
  </Row>

   <Row>
   

    <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control size='sm' type="password" placeholder="Password" />
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress1">
    <Form.Label>Address</Form.Label>
    <Form.Control size='sm' placeholder="1234 Main St" />
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress2">
    <Form.Label>Address 2</Form.Label>
    <Form.Control size='sm' placeholder="Apartment, studio, or floor" />
    </Form.Group>

    


   </Row>

   <Row>
      
   <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatoon' />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Provience</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatchewan' />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control size='sm' placeholder='eg. S7N 3CZ' />
    </Form.Group>

   </Row>

  

  

  

 

  

  <Button variant="primary" type="submit">
    Sign Up
  </Button> 
</Form>
  
<Link to="/registerBookStore">   <Button variant="link" size='sm' className='register-btn'> Register as a Bookstore Owner</Button>   </Link>
    

</div>











);


}