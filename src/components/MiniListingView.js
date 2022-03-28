import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import "./MiniListingView.css"
import Popup from "./Offerpopup.js"; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import { Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { Container } from 'react-bootstrap';

export const MiniListingView = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState();
    const [storeBranding, setStoreBranding] = useState();
    const [link, setLink] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [isBookstoreBook, setIsBookstoreBook] = useState(false);


    const fetchIamge = async () => {
        const imageURL = "http://localhost:8000/image/listings/" + props.listing._id + "/" + props.listing.imageNames[0];
        const res = await fetch(imageURL);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImage(imageObjectURL);
    }
    const fetchBranding = async () => {
        const imageURL = "http://localhost:8000/bookstore/branding/" + props.listing.posterID ;
        const res = await fetch(imageURL);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setStoreBranding(imageObjectURL);
    }

    useEffect(() => {
        if(props.MyListings == 1){
          setLink('/update/' + props.listing._id);
        }
        else{
          setLink('/listing/' + props.listing._id);
        }

        if(props.wish == 1){
          setLink('/wishlistItem/' + props.listing._id);
        }
        
        setTitle(props.listing.title);
        setPrice(props.listing.price);
        setDescription(props.listing.description);
        setIsBookstoreBook(props.listing.postedByStore);
        fetchIamge();
    }, []);

    useEffect(() => {
      if (isBookstoreBook){
        fetchBranding();
      } else {
        setStoreBranding();
      }
    }, [isBookstoreBook])

    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Description</Popover.Header>
          <Popover.Body>
            {description}
          </Popover.Body>
        </Popover>
      );

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
                <img src = {image} alt="icons" width="120" height="100" class="img-thumbnail"/>
            </div>
            
            {isBookstoreBook
              ? <div className="brandingImage">
                  <img src ={storeBranding} alt="icons" width="120" height="100" class="img-branding"/>
                </div>
              : <></>
            }
            
            <div className='image-info-sidebar'>
             <Container fluid>
             <Row>
              
             <p><Link to={link} className='link'>{title}</Link> &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Price : {price}$</p>
             
             

             

            
             <OverlayTrigger trigger="click" placement="right" overlay={popover}>
             <Button variant="outline-success" size='sm'>Description</Button>
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
    )
}