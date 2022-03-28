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
    const [loggedIn, setLoggedIn] = useState()
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);
    //console.log(props.update)

    // constant that will check if the wishlist button should be shown
    const [showWishlistButton, setShowWishlistButton] = useState(true);
    const [showRemoveFromWishlistButton, setShowRemoveFromWishlistButton] = useState(false);

    //Stuff to be grabbed from the database
    const {listingID} = useParams();
    
    const [user, setUser] = useState('');
     //Stuff to be grabbed from the database
    const [posterName, setPosterName] = useState('');
    const [image, setImage] = useState();
    const [email, setEmail] = useState();// This is for getting the users email 
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
    const listingURL = 'http://localhost:8000/user';
    //console.log(listingURL);
    
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
      setEmail(data.email);
    })
    .catch((error) =>{
        console.log(error);
    });


}, []);

    useEffect(() => {
        const listingURL = 'http://localhost:8000/listing/' + listingID;
        //console.log(listingURL);
        
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
          setPosterName(data.posterName);
          setImageName(data.imageNames[0]);
          setTitle(data.title);
          setPrice(data.price);
          setBookDescription(data.description);
          setTimestamp(data.timestamp);
          setUser(data.user);
          //setEmail(data.email)
          //Constantly checking if a user is logged in  
          setLoggedIn(props.user);

        })
        .catch((error) =>{
            console.log(error);
        });
    

    }, []);

    useEffect(() => {
      fetchIamge();
    }, [imageName]);

    const posterListingCheck = () =>{
      
    }   
    
    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Description</Popover.Header>
          <Popover.Body>
            Used like new, No ripped pages.
          </Popover.Body>
        </Popover>
      );


    useEffect(() => {
      setShowWishlistButton(props.showWishlistButton);
      setShowRemoveFromWishlistButton(props.showRemoveFromWishlistButton);
    }, [])

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

    const removeFromWishlist = () => {
      console.log("hello");
      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({listingID : props.id})
      };

      fetch('http://localhost:8000/remove-from-wishlist', requestOptions)
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

    //Trigger display if the offer if from a guest or not 
    const [showResults, setShowResults] = useState(false);

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
         // Conditional logic:
         const newErrors = findFormErrors()
        if ( Object.keys(newErrors).length > 0 ) {
        //errors!
        setErrors(newErrors)
        }

        const formItems = e.target.elements;
        const body = {
          posterName: posterName,
          email : formItems.formGridEmail.value,
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
            alert("You already sent an offer to this listing");
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
  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  const findFormErrors = () => {
    const formGridEmail = form;
    const newErrors = {}
    if ( !formGridEmail || formGridEmail === '' ) newErrors.formGridEmail = 'Email cannot be blank!'
    return newErrors;
  }
  

  
    return (
        
        <div className="Listingpage-form">
             
             
             <div className='thumbnail'>
             <img src={image} alt="..." width="300" height="300" class="img-thumbnail"  />  
             
             </div>
             
             
             
             
             <div className='image-info'>
             <Container  fluid='lg'>
             <Row>
            
            
             <p> Title : {title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Price : {price}$   &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Uploaded by : {posterName} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Upload date :{timestamp}</p> 
             <p> Description: {bookDescription} </p>
             
             

             
             
            
             {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
             <Button variant="outline-success" size='sm'>Discription</Button>
             </OverlayTrigger> <br></br> */}

             {posterName == user
             ? <div className='bttns'>
                
                <Button as={Link} to="/updatelisting" variant="outline-success" size='sm' className='Listing-update' type='submit' onClick={addToWishlist}>Update Listing</Button>
               <Button  variant="outline-danger" size='sm' className='offer-btn-del' type="submit" onClick={handleDelete}>Delete Listing</Button>

            </div>
             : <div className='bttns' ><Button 
             variant="outline-success" size='sm' className='offer-btn' type="submit" onClick={togglePopup}>Make a bid!</Button>
              
             <Button variant="outline-success" size='sm' className='wishlist-add-btn' type='submit' onClick={addToWishlist}>Add to wishlist</Button>
             <Button variant="outline-success" size='sm' className='wishlist-remove-btn' type='submit' onClick={removeFromWishlist}>Remove from wishlist</Button>
             </div>

             }
             
            
             
            
            
            </Row>
            </Container>
            
            
            
            
             </div>


             
            

            

           
            {/* <input type ="button" variant= "success" value ="Make a bid!" onClick={togglePopup}/>   */}
           
            {isOpen && <Popup
                content={<>
                
                <h1>Create an offer</h1>
                <Form onSubmit={handleSubmitClick}>
                <Col style = {{visibility : showResults ? "visibile" : "hidden"}}>
                  <h4>Your not logged in as a user. Please provide your email so the seller may reply to your offer.</h4>
                    <Row>
                      <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email:</Form.Label>
                         <Form.Control size='sm' type="email" placeholder="Enter email" onChange={ e => setField('formGridEmail', e.target.value) } isInvalid={ !!errors.formGridEmail }/>
                        <Form.Control.Feedback type='invalid'>
                        { errors.formGridEmail }
                        </Form.Control.Feedback>
                      </Form.Group>
                      
                    </Row> 
                </Col>

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