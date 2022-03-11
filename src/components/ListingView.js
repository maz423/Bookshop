import './ListingView.css'
import React,{useEffect, useState} from 'react';
import Popup from "./Offerpopup.js"; 
import {useNavigate, useParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

export const ListingView = (props) => {
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);

    //Stuff to be grabbed from the database
    const {listingID} = useParams();
    
    const [user, setUser] = useState('');
    const [price, setPrice] = useState('');
    const [bookName, setBookName] = useState('');
    const [bookDescription, setBookDescription] = useState('');

    useEffect(() => {
        const listingURL = 'http://localhost:8000/listing/' + listingID;
        console.log(listingURL);
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(listingURL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            console.log(data);
            setUser(data.user);
            setBookName(data.textname);
            setPrice(data.price);
            setBookDescription(data.bookDescription)
        })
        .catch((error) =>{
            console.log(error);
        });
    });

    //This function will open the popup page to make an offer
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const handleSubmitClick = (e) => { 
        e.preventDefault();
          const formItems = e.target.elements;
          //TODO check to ensure price is int
          //TODO File input
          const body = {
            offer : formItems.formOffer.value,
          };
          console.log(formItems);
          console.log(body);
          const requestOptions = {
              credentials: 'include',
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body : JSON.stringify(body)
          };
          
          fetch('http://localhost:8000/make-offer', requestOptions)
          .then((response) => {
            if (!response.ok){
              console.log("error sending offer");
            } else {
            }
          }).catch( (error)=>{
              console.log(error);
          });
          setIsOpen(false)
      };
  
  
    return (
        <div className="Listingpage-form">
            <h1>User:{user}</h1>
            <h1>Textbook: {bookName} Starting at: {price} </h1>
            <p>Description: {bookDescription}</p>
            <input type ="button" value ="Make a bid!" onClick={togglePopup}/>  
            {isOpen && <Popup
                content={<>
                
                <h1>Create an offer</h1>
                <Form onSubmit={handleSubmitClick}>
                <InputGroup>
                <InputGroup.Text>Offer:</InputGroup.Text>
                <Form.Control id="formOffer" as="textarea" aria-label="With textarea" />
                </InputGroup>
                <Button variant="success" type="submit">Send Offer</Button>
                </Form>

            </>}
      handleClose={togglePopup}
    />}
            <h1>User Rating:</h1>
        </div>
    );
}