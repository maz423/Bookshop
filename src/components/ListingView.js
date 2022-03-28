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
    const [update,setUpdate] = useState(props.update);
    const [wish,setWish] = useState(props.wish);
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);
    const [reportIsOpen, setReportIsOpen] = useState(false);

    // constant that will check if the wishlist button should be shown
    const [showWishlistButton, setShowWishlistButton] = useState(true);
    const [showRemoveFromWishlistButton, setShowRemoveFromWishlistButton] = useState(false);

    //Stuff to be grabbed from the database
    const {listingID} = useParams();
    
    const [user, setUser] = useState('');
    const [image, setImage] = useState();
    const [storeBranding, setStoreBranding] = useState();
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [imageName, setImageName] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [isBookstoreBook, setIsBookstoreBook] = useState(false);
    const [posterID, setPosterID] = useState('');

    const fetchIamge = async () => {
      const imageURL = "http://localhost:8000/image/listings/" + listingID + "/" + imageName;
      const res = await fetch(imageURL);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImage(imageObjectURL);
    }
    const fetchBranding = async () => {
      const imageURL = "http://localhost:8000/bookstore/branding/" + posterID ;
      console.log(imageURL);
      const res = await fetch(imageURL);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setStoreBranding(imageObjectURL);
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
            setPosterID(data.posterID);
            setIsBookstoreBook(data.postedByStore);
        })
        .catch((error) =>{
            console.log(error);
        });
    }, []);
    useEffect(() => {
      fetchIamge();
    }, [imageName]);
    useEffect(() => {
      if (isBookstoreBook) {
        fetchBranding();
      } else {
        setStoreBranding();
      }
    }, [isBookstoreBook])

    
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

    // const toggleReportPopup = () => {
    //     setReportIsOpen(!reportIsOpen);
    // }

    const handleDelete = () => {  //TODO-----
      // delete listing from DB. 

      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({listingID : listingID})
      };

      fetch('http://localhost:8000/remove-lis', requestOptions)
      .then((response) => {
        if(response.ok){
          console.log("ok");
        }
        else{

        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          alert("item added to whishlist");
          setWish(1);
          setUpdate(0);
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
        body : JSON.stringify({listingID : listingID})
      };

      fetch('http://localhost:8000/remove-from-wishlist', requestOptions)
      .then((response) => {
        if(response.ok){
          console.log('ok');
          alert("item removed from whishlist");
          setWish(0);
          setUpdate(0);
        }
        else{
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    // const reportListing = (e) => {
    //     e.preventDefault();
    //     const formItems = e.target.elements;
    //     const reason = formItems.formReport.value;

    //     const requestOptions = {
    //       credentials: 'include',
    //       method: 'POST',
    //       headers: {'Content-Type' : 'application/json'},
    //       body: JSON.stringify({user : user, listingID : listingID, reason : reason})
    //     }

    //     fetch('http://localhost:8000/reportPost', requestOptions)
    //     .then((response) => {
    //       if(response.ok){
    //         console.log("ok");
    //       }
    //       else{
    //         console.log("error");
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }

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
             {/* This can be moved somewhere else to look better */}
             {isBookstoreBook
              ? <div className="brandingImage">
                  <img src ={storeBranding} alt="icons" width="120" height="100" class="img-branding"/>
                </div>
              : <></>
            }
             
             
             
             
             <div className='image-info'>
             <Container  fluid='lg'>
             <Row>
            
            
             <p> Title : {title} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Price : {price}$   &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Uploaded by : {user} &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Upload date :{timestamp}</p> 
             <p> Description: {bookDescription} </p>
             
             

             
             
            
             {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
             <Button variant="outline-success" size='sm'>Discription</Button>
             </OverlayTrigger> <br></br> */}

             
             {update == 1 && wish == 0
             ? <div className='bttns' >
                
                <Button as={Link} to="/updatelisting" variant="success" size='sm' className='wishlist-add-btn' type='submit' >Update Listing</Button> &nbsp;
                {/* <Button as={Link} to="/updatelisting" variant="outline-success" size='sm' className='wishlist-remove-btn' type='submit' onClick={removeFromWishlist}>Update Listing</Button> */}
               <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleDelete}>Delete Listing</Button>
               <>&nbsp;</>

            </div>
             : <></>

             }

             {wish == 1 && update == 0
             ? <div className='bttns'><Button   variant="success" size='sm' className='offer-btn' type="submit" onClick={togglePopup}>Make a bid!</Button>&nbsp;
              
             
             <Button variant="danger" size='sm' className='wishlist-remove-btn' type='submit' onClick={removeFromWishlist}>Remove from wishlist</Button>
             <>&nbsp;</>
             </div>
             :<></>


             }

             {update == 0 && wish == 0
             ? <div className='bttns'><Button   variant="success" size='sm' className='offer-btn' type="submit" onClick={togglePopup}>Make a bid!</Button> &nbsp;
              
             <Button variant="success" size='sm' className='wishlist-add-btn' type='submit' onClick={addToWishlist}>Add to wishlist</Button> 
             <>&nbsp;</>
             </div>
             
             :<></>


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

          {/* {reportIsOpen && <Popup
                content={<>
                
                <p>Report a Listing</p>
                <Form onSubmit={reportListing}>
                <InputGroup>
                <InputGroup.Text>Reason:</InputGroup.Text>
                <Form.Control id="formReport" as="textarea" aria-label="With textarea" />
                </InputGroup>
                <Button  type="submit">Submit Report</Button>
                </Form>

            </>}
                handleClose={toggleReportPopup}
            />} */}
            
            
        </div>
        
    );
}