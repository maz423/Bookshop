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
import { useState, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { render } from '@testing-library/react';





export const Sidebar = (props) => {

  const [show, setShow] = useState(false);

  //This is a rough implementation
  //TODO Make resizable solution that you can chose how many links appear
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [link3, setLink3] = useState('');
  const [link4, setLink4] = useState('');
  const [link5, setLink5] = useState('');
  const [link6, setLink6] = useState('');
  const [link7, setLink7] = useState('');
  const [link8, setLink8] = useState('');
  const [link9, setLink9] = useState('');
  const [link10, setLink10] = useState('');

  const listingsPerPage = 10;
  var page = 1;
    
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleGetListings = () => {
    const requestOptions = {
      credentials: 'include',
      method: 'GET',
      headers: {'Content-Type' : 'application/json'},
    };
    const URL = 'http://localhost:8000/listings/' + listingsPerPage + "/" + page;
    fetch(URL, requestOptions)
    .then((response) => {
      if (!response.ok){
        alert("Error getting desired listings");
      } else {
        return response.json()
      }
    })
    .then((data) => {
      const link = '/listing/'
      setLink1(link + data[0]._id);
      setLink2(link + data[1]._id);
      setLink3(link + data[2]._id);
      setLink4(link + data[3]._id);
      setLink5(link + data[4]._id);
      setLink6(link + data[5]._id);
      setLink7(link + data[6]._id);
      setLink8(link + data[7]._id);
      setLink9(link + data[8]._id);
      setLink10(link + data[9]._id);

      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleNextPage = () => {
    page += 1;
    handleGetListings();
  }

  const handlePreviousPage = () => {
    if (page > 1){
      page -= 1;
      handleGetListings();
    }
  }

  useEffect(()=>{
    handleGetListings();
  }, [])


  
  return (
        <div>
          
          <Button variant="outline-success" onClick={handleShow}>
            Active listings
          </Button>
          
          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Active Listings:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="Listings nav">
                <Nav.Link as={Link} to={link1}>Lisitng1</Nav.Link>
                <Nav.Link as={Link} to={link2}>Lisitng2</Nav.Link>
                <Nav.Link as={Link} to={link3}>Lisitng3</Nav.Link>
                <Nav.Link as={Link} to={link4}>Lisitng4</Nav.Link>
                <Nav.Link as={Link} to={link5}>Lisitng5</Nav.Link>
                <Nav.Link as={Link} to={link6}>Lisitng6</Nav.Link>
                <Nav.Link as={Link} to={link7}>Lisitng7</Nav.Link>
                <Nav.Link as={Link} to={link8}>Lisitng8</Nav.Link>
                <Nav.Link as={Link} to={link9}>Lisitng9</Nav.Link>
                <Nav.Link as={Link} to={link10}>Lisitng10</Nav.Link>
              </Nav>
              <Button id="nextPageButton">Next Page</Button>
              <Button id="previousPageButton">Previous Page</Button>
           </Offcanvas.Body>
          </Offcanvas>
        </div>
      );

}
    
    
   
   
