import './Homepage.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import {Navi} from './Navi'
import {useState} from 'react'
import { Offcanvas } from 'bootstrap';
import {render} from 'react-dom'
import { Sidebar } from './Sidebar';
import { SidebarBookstore } from './SidebarBookstore';
import { Container } from 'react-bootstrap';





  
  




export const Homepage = (props) => {

const handleSubmitClick = (e) => { //handle submit event.

    }
        

return (

 
    
    <div className='bg'>
        
       
       <h1 className='h1'>Welcome to Bookshop </h1>
       <h2 className='h2'>The one stop shop for buying and selling used books in Saskatoon </h2>
      
       <div className='btn-group'>
       <div className='btn'><Sidebar/> </div>
       <div className='btn'><SidebarBookstore/></div>
      
       </div>
        
     

      </div>
      


    



    



  

  

  

 

  












);


}