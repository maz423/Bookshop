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
import { ListOfListings } from './ListOfListings';




export const Sidebar = (props) => {

  const [show, setShow] = useState(false);

  //This is a rough implementation
  //TODO Make resizable solution that you can chose how many links appear
  const [listingsList, setListingsList] = useState([]);

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
      setListingsList(data);

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
              {/* {
                listingsList.map(element => <div className="text-center"><Link to={'/listing/' + element._id}><h3>{element.title}</h3></Link></div>)
              } */}
              <ListOfListings listings={listingsList}></ListOfListings>
              <Button id="nextPageButton" onClick={handleNextPage}>Next Page</Button>
              <Button id="previousPageButton" onclick={handlePreviousPage}>Previous Page</Button>
           </Offcanvas.Body>
          </Offcanvas>
        </div>
      );

}
    
    
   
   
