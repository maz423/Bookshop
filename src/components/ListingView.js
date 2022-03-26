import './ListingView.css'
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

import { Link } from 'react-router-dom';


export const ListingView = (props) => {
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);

    // constant that will check if the user is viewing their search results or their wishlist
    const [isSearchResults, setIsSearchResults] = useState(true);

    //Stuff to be grabbed from the database
    const {listingID} = useParams();
    
    const [user, setUser] = useState('');
    const [image, setImage] = useState();
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [imageName, setImageName] = useState('');
    const [timestamp, setTimestamp] = useState('');

    const fetchIamge = async () => {
      const imageURL = "http://localhost:8000/image/listings/" + listingID + "/" + imageName;
      const res = await fetch(imageURL);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImage(imageObjectURL);
  }

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
            setUser(data.posterName);
            setImageName(data.imageNames[0]);
            setTitle(data.title);
            setPrice(data.price);
            setBookDescription(data.description);
            setTimestamp(data.timestamp);
        })
        .catch((error) =>{
            console.log(error);
        });
    }, []);
    useEffect(() => {
      fetchIamge();
    }, [imageName]);

    
    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Description</Popover.Header>
          <Popover.Body>
            Used like new, No ripped pages.
          </Popover.Body>
        </Popover>
      );

    //This function will open the popup page to make an offer
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const handleDelete = () => {  //TODO-----
      // delete listing from DB. 
    }

    

    const addToWishlist = () => {
      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({listingID : listingID})
      };

      fetch('http://localhost:8000/add-to-wishlist', requestOptions)
      .then((response) => {
        if(response.ok){
          console.log('ok');
        }
        else{

        }
      })
      .catch((error) => {
        console.log(error);
      });
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
             
             
             <div className='thumbnail'>
             <img src={image} alt="..." width="300" height="300" class="img-thumbnail"  />  
             
             </div>
             
             
             
             
             <div className='image-info'>
             <Container  fluid='lg'>
             <Row>
            
            
             <p> Title : {title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Price : {price}$   &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Uploaded by : {user} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Upload date :{timestamp}</p> 
             <p> Description: {bookDescription} </p>
             
             

             
             
            
             {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
             <Button variant="outline-success" size='sm'>Discription</Button>
             </OverlayTrigger> <br></br> */}

             
             {props.update == true
             ? <div className='bttns' >
                
                <Button as={Link} to="/updatelisting" variant="outline-success" size='sm' className='wishlist-add-btn' type='submit' onClick={addToWishlist}>Update Listing</Button>
               <Button  variant="outline-danger" size='sm' className='offer-btn' type="submit" onClick={handleDelete}>Delete Listing</Button>

            </div>
             : <div className='bttns'><Button   variant="outline-success" size='sm' className='offer-btn' type="submit" onClick={togglePopup}>Make a bid!</Button>
              
             <Button variant="outline-success" size='sm' className='wishlist-add-btn' type='submit' onClick={addToWishlist}>Add to wishlist</Button>
             </div>

             }
             
            
             
             
             
            
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