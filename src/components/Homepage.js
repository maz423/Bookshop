import './Homepage.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import {Navi} from './Navi'




export const Homepage = (props) => {

const handleSubmitClick = (e) => { //handle submit event.

    }
        

return (

 
    
    <div className='bg'>
        
       
        <h1 className='logo'>Bookshop</h1>
    <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Enter your location to get started"
          className="me-2"
          aria-label="Search"
          size='md'
        />
       <Button variant="success">Submit</Button>{' '}
    
      </Form>

      </div>


    



  

  

  

 

  












);


}