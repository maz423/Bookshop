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
    
    const [Isbanned,setIsbanned] = useState(0);

    const [userID, setUserID] = useState('');
    const [accountType, setAccountType] = useState('');
    const [email, setEmail] = useState('');
    const [accountName, setAccountName] = useState('');

    //Onload
    useEffect(() => {
        const user = props.user;
        setUserID(user._id);
        setAccountType(user.accountType);
        setEmail(user.email);

        if (accountType == 'Bookstore'){
            setAccountName(user.companyName);
        } else {
            setAccountName(user.username);
        }
    }, [props.user])



    const handleBanClick = () => {
      //Send the information to 
      const body = {
        accountName : accountName,
        accountID : userID,
        accountType : accountType,
        accountEmail : email,
      };
      const requestOptions = {
          credentials: 'include',
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body : JSON.stringify(body)
      };
      
      fetch('http://localhost:8000/banUser', requestOptions)
      .then((response) => {
        if (!response.ok){
            console.log("error Banning User");
        } else {
            setIsbanned(1);
        }
      })
      .catch( (error)=>{
          console.log(error);
      });
    }

    const handleclick2 = () => {
        setIsbanned(0);
    }

    

    
  
    return (
        
        <div className="Listingpage-form">
             
             <div className='thumbnail'>
             <img src='https://secondchancetinyhomes.org/wp-content/uploads/2016/09/empty-profile.png' alt="..." width="300" height="300" class="img-thumbnail"  /> 
             </div>
             

             
             
             <div className='image-info'>
             <Container  fluid='lg'>
             <Row>

             
             
             <p> First Name :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;   Last Name :    &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; UserID :  &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; Date joined :</p> 
             {/* <p> Description: {bookDescription} </p> */}
             
             

             
             <ButtonGroup >
            {Isbanned == 0
            ? <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleBanClick} >Ban User</Button>
            
            : <Button  variant="success" size='sm' className='offer-btn' type="submit" onClick={handleclick2} >Unban User</Button>
          
          }
             
            
             </ButtonGroup>
             
             
            
            </Row>
            </Container>
            
            
            
            
             </div>

        </div>
        
    );
}