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
import { ButtonGroup, Popover } from 'react-bootstrap';
import { OverlayTrigger } from 'react-bootstrap';
import { Container } from 'react-bootstrap';


export const UserView = (props) => {
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
    const [Isbanned,setIsbanned] = useState(0);

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

    const handleclick = () => {
      setIsbanned(1);
  }

  const handleclick2 = () => {
    setIsbanned(0);
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
             <img src='https://secondchancetinyhomes.org/wp-content/uploads/2016/09/empty-profile.png' alt="..." width="300" height="300" class="img-thumbnail"  /> 
             </div>
             

             
             
             <div className='image-info'>
             <Container  fluid='lg'>
             <Row>
            
             <p> First Name :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Last Name :    &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; UserID :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Date joined :{timestamp}</p> 
             {/* <p> Description: {bookDescription} </p> */}
             
             

             
             <ButtonGroup >
            {Isbanned == 0
            ? <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleclick} >Ban User</Button>
            
            : <Button  variant="success" size='sm' className='offer-btn' type="submit" onClick={handleclick2} >Unban User</Button>
          
          }
             
             
             
             <Button variant="success" size='sm' className='wishlist-add-btn' type='submit' >Listings</Button>
            
             </ButtonGroup>
             
             
            
            </Row>
            </Container>
            
            
            
            
             </div>


             
            

            

           
            {/* <input type ="button" variant= "success" value ="Make a bid!" onClick={togglePopup}/>   */}
           
              
            {/* {isOpen && <Popup
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
    />} */}
            
            
        </div>
        
    );
}