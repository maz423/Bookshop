import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {faCode} from "react-icons/fa";
import { ListOfListings } from './ListOfListings';
import Popup from "./Offerpopup.js"; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Grid from 'react-bootstrap/'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'


function MyListings (props){

    const { userID } = useParams();
    const [listings,setListings] = useState([])

    //Popup condition too see the previous price of the book
    const [pricePop,setPricePop] = useState(false);

    //Holds the price of the book 
    const [price, setPrice] = useState(0);

    //For closing and opening the popup
    const togglePopup = () => {
        setPricePop(!pricePop);
    }

    //See the sold value of the book sold 
    const seePrice = (currentPrice) => {
        togglePopup();
        setPrice(currentPrice)
    }

    //grabs the stuff needed form the database 
    useEffect(() => {
        const listingURL = '';
        if (props.bookstore == 1 && props.user == 0){
            listingURL = 'http://localhost:8000/bookstore';//Change for proper server connections
        }
        //console.log(listingURL);
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
            
        };
        //alert(userID);
        fetch(listingURL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            //Set the data in the object as a list for now
            console.log(data);
            setListings(data)
        })
        .catch((error) =>{
            console.log(error);
        });
    }, []);

    const deleteListing = (id) => {

        console.log("here");
        setListings(listings.filter(item => item.listingID!== id))
        const requestOptions = {
               credentials: 'include',
               method: 'POST',
               headers: {'Content-Type' : 'application/json'},
               body : JSON.stringify({
                listingID:id
               })
        };
        fetch('http://localhost:8000/remove-listing', requestOptions) //change router
        .then((response) => {
               
               if(response.ok){
                   alert(`Deleted${id}`) //Alert the page that it has been deleted 
                    return response.json();
                      
               }
               else{
 
               }
        })
        .catch((error) => {
               console.log(error);
        });
    }

    const handleSubmitReport = (e) => { 
        e.preventDefault();
    
    
        const formItems = e.target.elements;
        const body = {
            price : formItems.formPrice.value,
        };
    
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify(body),
        };

        fetch('http://localhost:8000/bookstorereports', requestOptions)//Change url
        .then((response) => {
            if (!response.ok){
                alert("error sending info");
            } else {
                //navigate('/')
            }
        }).catch( (error)=>{
            console.log(error);
         });
            
      };
    
        
    let contentDisp; 
    //grab listings of user.
    if (props.bookstore == 1 && props.user == 0){ //grab Listings posted by Bookstore 
        contentDisp =  listings.map((book, key)=>{
            return(
                <div key={key}>
                    <Container fluid="lg">
    
                    <Row>
                    <p> Book:  {book.title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Author : {book.author}   &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; 
                        Price : {book.price} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; condition :{book.condition}</p>
                    </Row>
                    <Row>
                    <p> 
                   <Button onClick={() =>{seePrice(book.price)}}>Selling the book</Button>
                   <Button onClick={() =>{deleteListing(book.listingID)}}>Delete Book</Button>
                    </p>
                    </Row>
                    </Container>
    
                </div>
            )
            })
    }
    else{ //grab listings from user

    }

    return (
        <div><h1> Users/Bookstores Listings will be shown here</h1>

        {/* <ListOfListings listings = {Listings} MyListings = {1}/> */}
        {/* {Display the content on the page } */}
        <div ClassName="Offers-Recieved">
              {/* {Display the content on the page } */}
            <h1 className="No">My Stock</h1>
            {contentDisp}
                {/* {Popup } */}
            {pricePop && <Popup
                    content={
                        <div>
                        <h1>Price Being Sold at </h1> 
                        <p>{price}</p>
                        {/* {Doesn't handle int checking } */}
                        <Form onSubmit={handleSubmitReport}>
                        <Form.Group as={Col}  controlId="formPrice">
                        <Form.Label>Edit price </Form.Label>
                        <Form.Control size='sm' placeholder="Price" 
                        onChange={ e => setPrice('Price', e.target.value) }/>
                        </Form.Group>
                        </Form>
                        </div>
                        
                    }
                    handleClose={togglePopup}
                    />}
        </div>
        
        </div>
    )
}


export default MyListings;