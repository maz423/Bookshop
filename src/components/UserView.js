import './ListingView.css'
import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import { ButtonGroup, Popover } from 'react-bootstrap';
import { Container } from 'react-bootstrap';



export const UserView = (props) => {
    //Constant that will check if the popup page is open 
    const [isOpen, setIsOpen] = useState(false);
    
    const [Isbanned,setIsbanned] = useState(false);

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
        setIsbanned(user.isBanned);
    }, [props.user])



    const handleBanClick = () => {
      //Send the information to the server
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
            setIsbanned(true);
        }
      })
      .catch( (error)=>{
          console.log(error);
      });
    }

    const handleUnbanClick = () => {
        //Send the information to 
      const body = {
        accountName : accountName,
        accountID : userID,
        accountType : accountType,
      };
      const requestOptions = {
          credentials: 'include',
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body : JSON.stringify(body)
      };
      
      fetch('http://localhost:8000/unbanUser', requestOptions)
      .then((response) => {
        if (!response.ok){
            console.log("error unbanning User");
        } else {
            setIsbanned(false);
        }
      })
      .catch( (error)=>{
          console.log(error);
      });
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
            {Isbanned
            ? <Button  variant="success" size='sm' className='offer-btn' type="submit" onClick={handleUnbanClick} >Unban User</Button> 
            
            : <Button  variant="danger" size='sm' className='offer-btn' type="submit" onClick={handleBanClick} >Ban User</Button> 
          
          }
             
            
             </ButtonGroup>
             
             
            
            </Row>
            </Container>
            
            
            
            
             </div>

        </div>
        
    );
}