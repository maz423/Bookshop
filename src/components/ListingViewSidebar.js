import './ListingsViewSidebar.css'
import React,{useEffect, useState} from 'react';
import Popup from "./Offerpopup.js"; 
import {useNavigate, useParams} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Image from 'react-bootstrap/Image'
import Figure from 'react-bootstrap/Figure'
import { Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { Container } from 'react-bootstrap';


export const ListingViewSidebar = (props) => {
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);

    //Stuff to be grabbed from the database
    const {listingID} = useParams();
    
    const [user, setUser] = useState('');
    const [price, setPrice] = useState('');
    const [bookName, setBookName] = useState('');
    const [bookDescription, setBookDescription] = useState('');

    

    // useEffect(() => {
    //     const listingURL = 'http://localhost:8000/listing/' + listingID;
    //     console.log(listingURL);
    //     const requestOptions = {
    //         credentials: 'include',
    //         method: 'GET',
    //         headers: {'Content-Type' : 'application/json'},
    //     };

    //     fetch(listingURL, requestOptions)
    //     .then((response) => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //         }
    //     })
    //     .then((data) => {
    //         console.log(data);
    //         setUser(data.user);
    //         setBookName(data.textname);
    //         setPrice(data.price);
    //         setBookDescription(data.bookDescription)
    //     })
    //     .catch((error) =>{
    //         console.log(error);
    //     });
    // }, []);


    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Discription</Popover.Header>
          <Popover.Body>
            Used like new, No ripped pages.
          </Popover.Body>
        </Popover>
      );

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
        
        <div className="Listingpagebox">
             
             <div className='thumbnail'>
             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQicIRGNXnDUnz_FTP9aJ0m2fB05MH-8YL0Y9h154mwQjWUs72k9-MefI8KwWa6JzchDF0&usqp=CAU" alt="..." width="120" height="100" class="img-thumbnail"  /> 
             </div>
             
             <div className='image-info-sidebar'>
             <Container fluid>
             <Row>
            
             <p> Title : {props.title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Price : {'5'}$  </p> 
             
             

             

            
             <OverlayTrigger trigger="click" placement="right" overlay={popover}>
             <Button variant="outline-success" size='sm'>Discription</Button>
             </OverlayTrigger> <br></br><br></br><br></br><br></br>
             <Button  variant="outline-success" size='sm' className='offer-btn' type="submit" onClick={togglePopup}>Make a bid!</Button>
            
             
             
             
            
            </Row>
            </Container>
            
            
            
            
             </div>


             
            

            

           
            {/* <input type ="button" variant= "success" value ="Make a bid!" onClick={togglePopup}/>   */}
           
              
            {isOpen && <Popup
                content={<>
                
                <p>Create an offer</p>
                <Form onSubmit={handleSubmitClick}>
                <InputGroup>
                <InputGroup.Text>Offer:</InputGroup.Text>
                <Form.Control id="formOffer" as="textarea" aria-label="With textarea" />
                </InputGroup>
                <Button  type="submit">Send Offer</Button>
                </Form>

            </>}
      handleClose={togglePopup}
    />}
            
            
        </div>
        
    );
}