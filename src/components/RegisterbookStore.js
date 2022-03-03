import './Register.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import {Navi} from './Navi.js'
import {Sidebar} from './Sidebar'


export const RegisterbookStore = (props) => {

const handleSubmitClick = (e) => { //handle submit event.
  e.preventDefault();
  const formItems = e.target.elements;
  const body = {
    companyName : formItems.formCompanyName.value, 
    password : formItems.formGridPassword.value,
    email : formItems.formGridEmail.value,
    address1 : formItems.formGridAddress1.value,
    address2 : formItems.formGridAddress2.value 
  }

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body : JSON.stringify(body)
  };

  fetch('http://localhost:8000/registerBookStore', requestOptions)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
}
        

return (

  
<div className="mb-3">



<Form onSubmit={handleSubmitClick}>
  <Row >
    <Form.Group as={Col} controlId="formCompanyName">
      <Form.Label>Username</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Enter Company Name" />
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

  

  

  

 

  

  <Button variant="success" type="submit">
    Sign Up
  </Button> 
</Form>
  
<Link to="/registerBookStore">   <Button variant="link" size='sm' className='register-btn'> Register as a Bookstore Owner</Button>   </Link>
    

</div>











);
}