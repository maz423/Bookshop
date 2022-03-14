import './Register.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link, Navigate } from 'react-router-dom';
import {Navi} from './Navi.js'
import {Sidebar} from './Sidebar'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export const RegisterbookStore = (props) => {

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

const navigate = useNavigate();

const setField = (field, value) => {
  setForm({
    ...form,
    [field]: value
  })
  if ( !!errors[field] ) setErrors({
    ...errors,
    [field]: null
  })
}

const findFormErrors = () => {
  const {formCompanyName, formGridEmail, formGridPassword, formGridAddress1, formGridCity,formGridState, formGridZip } = form
  const newErrors = {}
  // name errors
  if ( !formCompanyName || formCompanyName === '' ) newErrors.formCompanyName = ' Company name cannot be blank!'
  else if ( formCompanyName.length > 20 ) newErrors.formCompanyName = 'Company name is too long!'
  
  

  if ( !formGridEmail || formGridEmail === '' ) newErrors.formGridEmail = 'Email cannot be blank!'

  if ( !formGridPassword || formGridPassword === '' ) newErrors.formGridPassword = 'Password cannot be blank!'
  else if ( formGridPassword.length > 16 ) newErrors.formGridPassword = ' Password too long!'

  if ( !formGridAddress1 || formGridAddress1 === '' ) newErrors.formGridAddress1 = 'Address feild cannot be blank!'

  if ( !formGridCity || formGridCity === '' ) newErrors.formGridCity = 'City cannot be blank!'

  if ( !formGridState || formGridState === '' ) newErrors.formGridState = 'Provience cannot be blank!'

  if ( !formGridZip || formGridZip === '' ) newErrors.formGridZip = 'Zip code cannot be blank!'
  

  return newErrors
}

const handleSubmitClick = (e) => { //handle submit event.
  e.preventDefault();

  const newErrors = findFormErrors()
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      //errors!
      setErrors(newErrors)
    } else {


  const formItems = e.target.elements;
  const body = {
    companyName : formItems.formCompanyName.value, 
    password : formItems.formGridPassword.value,
    email : formItems.formGridEmail.value,
    address1 : formItems.formGridAddress1.value,
    address2 : formItems.formGridAddress2.value,
    city : formItems.formGridCity.value,
    province : formItems.formGridState.value,
    zipcode : formItems.formGridZip.value, 
  }

  const requestOptions = {
    credentials: 'include',
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body : JSON.stringify(body)
  };

  fetch('http://localhost:8000/registerBookstore', requestOptions)
  .then((result) => {
    if (!result.ok){
      alert("Username or password is already in use");  
    }
    else {
      console.log(result);
      alert('Bookstore successfully Registered');
      navigate("/Login");
    }
   
  })
  .catch((error) => {
    console.log(error);
  });
}
}
        

return (

  
<div className="mb-3">



<Form onSubmit={handleSubmitClick}>
  <Row >
    <Form.Group as={Col} controlId="formCompanyName">
      <Form.Label>Username</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Enter Company Name" onChange={ e => setField('formCompanyName', e.target.value) } isInvalid={ !!errors.formCompanyName } />
      <Form.Control.Feedback type='invalid'>
        { errors.formCompanyName }
    </Form.Control.Feedback>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control size='sm' type="email" placeholder="Enter email" onChange={ e => setField('formGridEmail', e.target.value) } isInvalid={ !!errors.formGridEmail }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridEmail }
    </Form.Control.Feedback>
    </Form.Group>


   
  </Row>

   <Row>
   

   <Form.Group as={Col} controlId="formGridPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control size='sm' type="password" placeholder="Password" onChange={ e => setField('formGridPassword', e.target.value) } isInvalid={ !!errors.formGridPassword }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridPassword }
    </Form.Control.Feedback>
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress1">
    <Form.Label>Address</Form.Label>
    <Form.Control size='sm' placeholder="1234 Main St" onChange={ e => setField('formGridAddress1', e.target.value) } isInvalid={ !!errors.formGridAddress1 } /> 
    <Form.Control.Feedback type='invalid'>
        { errors.formGridAddress1 }
    </Form.Control.Feedback>
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress2">
    <Form.Label>Address 2</Form.Label>
    <Form.Control size='sm' placeholder="Apartment, studio, or floor" />
    </Form.Group>

    


   </Row>

   <Row>
      
   <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatoon' onChange={ e => setField('formGridCity', e.target.value) } isInvalid={ !!errors.formGridCity }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridCity }
    </Form.Control.Feedback>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Provience</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatchewan' onChange={ e => setField('formGridState', e.target.value) } isInvalid={ !!errors.formGridState } />
      <Form.Control.Feedback type='invalid'>
        { errors.formGridState }
    </Form.Control.Feedback>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control size='sm' placeholder='eg. S7N 3CZ' onChange={ e => setField('formGridZip', e.target.value) } isInvalid={ !!errors.formGridZip }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridZip }
    </Form.Control.Feedback>
    </Form.Group>

   </Row>

  

  

  

 

  

  <Button variant="success" type="submit">
    Sign Up
  </Button> 
</Form>
  
{/* <Link to="/registerBookStore">   <Button variant="link" size='sm' className='register-btn'> Register as a Bookstore Owner</Button>   </Link> */}
    

</div>











);
}