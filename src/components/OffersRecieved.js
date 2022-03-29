import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {faCode} from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';
import Popup from "./Offerpopup.js"; 
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom';

function OffersRecieved (params){
    const navigate = useNavigate();

    const { userID } = useParams();

    //Will I need this? 
    const [name, setName ] = useState(''); //For now, if the offer was a guest it will just display 
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [offers, setOffers] = useState([]);

    const [image, setImage] = useState();
    

    useEffect(() => {
        const listingURL = 'http://localhost:8000/get-offers';
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
            console.log(data);
            setOffers(data)
        })
        .catch((error) =>{
            console.log(error);
        });
    }, []);
   
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);
     //This function will open the popup page to make an offer
     const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const [offerDesc,setOfferDesc] = useState('');

    const seeOffer = (offerDesc) => {
        togglePopup();
        setOfferDesc(offerDesc);
    }


    const deleteOffer = (id,lid) => {

        console.log("here");
        setOffers(offers.filter(item => item.email !== id))

        const requestOptions = {
               credentials: 'include',
               method: 'POST',
               headers: {'Content-Type' : 'application/json'},
               body : JSON.stringify({
                posterName: userID,
                   email:id,
                   lid:lid
               })
        };
        fetch('http://localhost:8000/remove-offers', requestOptions)
        .then((response) => {
               
               if(response.ok){
                    return response.json();
                      
               }
               else{
 
               }
        })
        .catch((error) => {
               console.log(error);
        });
        
 
 
 }
   //Sending offer to the server
   const handleSubmitClick = (e) => { 
    //alert(loggedIn);
   if (loggedIn == 1){
     e.preventDefault();
       const formItems = e.target.elements;
       alert(formItems.formOffer.value)
       const body = {
         nameUserOffer:user,
         posterName: posterName,
         email : email,
         //phone_number : formItems.formPhoneNumber.value,
         guest: false,
         offer : formItems.formOffer.value,
         listingID: listingID,
         title: title,
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

   }
   //Users not logged then its a guest write a 
   else {      
     e.preventDefault();
     console.log('Went to else statement')
     if (showResults==false){
       setShowResults(true);
 
       setIsOpen(false)
       setTimeout(function() {
         console.log("in the setTimout")  
         setIsOpen(true);
       },250)
     }
     //Finally send a fetch call to the server to store the guest
     else{
       e.preventDefault();
       const formItems = e.target.elements;
       const body = {
         posterName: posterName,
         email : formItems.formEmail.value,
         //phone_number : formItems.formPhoneNumber.value,
         guest: true,
         listingID: listingID,
         offer : formItems.formOffer.value,
         title: title,

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
       setShowResults(false);
     }
  }
 }

    return (
        <div ClassName="Offers-Recieved">
            <h1 className="No">My Offers</h1>
            {isOpen && <Popup
                    content={
                        <div>
                        <h1>Offer Description</h1> 
                        <p>{offerDesc}</p>
                        </div>
                    }
                    handleClose={togglePopup}
                    />}
            {offers.map((offers, key)=>{
        return(
            <div key={key}>
                <Container fluid="lg">

                <Row>
                <p> From : {offers.name} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Email : {offers.email}   &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; 
                Title : {offers.title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Upload date :{offers.date}</p>
                </Row>
                <Row>
                <p> <Button onClick={() => deleteOffer(offers.email, offers.listingID)}>Decline</Button> &nbsp;&nbsp; &nbsp; &nbsp;  
                <Button onClick={() => seeOffer(offers.offer)}>See Offer</Button> &nbsp;&nbsp; &nbsp; &nbsp;  
                <Button onClick={() => navigate(`/listing/${offers.listingID}`)}>Listing Page</Button>
                </p>
                </Row>
                </Container>

            </div>
        )
        })}
        
        </div>
    )
}


export default OffersRecieved;

