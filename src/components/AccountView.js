import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './AccountView.css';
import Popup from "./Offerpopup.js"; 
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Grid from 'react-bootstrap/'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import StarRatingGrab from './StarRatingGrab.js';
import StarRatingInput from './StarRatingInput.js';
import {BsFillFileEarmarkPersonFill } from 'react-icons/bs'

function AccountView(){

    //Constants that will open the pop up pages
    const [UserPU, setOpenUserPU] = useState(false);
    
    const [ form, setForm ] = useState({})

    const setField = (field, value) => {
        setForm({
          ...form,
          [field]: value
        })
        // if ( !!errors[field] ) setErrors({
        //   ...errors,
        //   [field]: null
        // })
      }

    //These functions will open the popup page to edit profile
    const toggleUserPU = () => {
        setOpenUserPU(!UserPU);
    }

    const navigate = useNavigate();

    //Username is the only constant that needs to be updated 
    const [oldUserName, setOldUserName] = useState('');

    //User info to grab from the database 
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail]= useState('');

    //Location info to grab from the database 
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [zip, setZip] = useState('');

    useEffect(() => {
        const userURL = 'http://localhost:8000/user';
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(userURL, requestOptions)
        .then((response) => {
            if (!response.ok){
                //navigate("/");
            }
            else {
                return response.json();
            }
        })
        .then((data) => {
            //User info section
            console.log(data);
            setOldUserName(data.username);
            setFirstName(data.fName);
            setLastName(data.lName);
            setEmail(data.email);

            //Location info
            setAddress1(data.address1);
            setAddress2(data.address2);
            setCity(data.city);
            setProvince(data.province);
            setZip(data.zipcode);
        })
        .catch((error) => {
            console.log(error);
        });
    });

    const onPhotoChange = (e) => {
        //hello
    }
    const handleSubmitUser = (e) => { 
        e.preventDefault();
    
    
        const formItems = e.target.elements;
        const body = {
            username : formItems.formUsername.value,
            fName : formItems.formFirstName.value,
            lName : formItems.formLastName.value,
            email : formItems.formGridEmail.value,
            address1 : formItems.formGridAddress1.value,
            address2 : formItems.formGridAddress2.value ,
            city : formItems.formGridCity.value,
            province : formItems.formGridState.value,
            zipcode : formItems.formGridZip.value,
        };
    
        const requestOptions = {
            credentials: 'include',
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify(body),
        };

        fetch('http://localhost:8000/update_user', requestOptions)
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
  

    return (
        <Container className = "AccountView">
            <Row className="whole-thig">
                <Col className="First-column">
                    <h1>My Profile</h1>
                    <label>ICON PLACEHOLDER SELLER IMAGE(IF WE HAVE TIME))</label>
                    <BsFillFileEarmarkPersonFill size={75} />
                    <Form.Group as={Col} controlId="formFileMultiple" onChange={ e => onPhotoChange(e)}>
                    <Form.Label>Update </Form.Label>
                    <Form.Control type="file" multiple size='sm' />
                    </Form.Group>

                    <Container className="First-userInfo">
                        <h6>Username:{username}</h6>
                        <h6>Full Name: {firstName} {lastName}</h6>
                        <h6>Email: {email}</h6>
                        <Button variant="success" type="submit" onClick={toggleUserPU}>
                            Edit
                        </Button> 
                    </Container>


                </Col>

                <Col className="Second-column">
                    <Col>
                        <h1>My Rating</h1>
                        <Row >
                            {StarRatingInput("hello")}
                        </Row>
                    </Col>
                    <Col>
                        <h1>Location Info</h1>
                        <h6>City {city},{province}</h6>
                        <h6>Province {city},{province}</h6>
                        <h6>Address1: {address1}</h6>
                        <h6>Address2: {address2}</h6>
                        <h6>Zip Code: {zip} </h6>
                        <Col>
                        <Row>
                        <Button variant="success" type="submit">
                            My Listings
                        </Button> 
                        </Row>
                        
                        <Row>
                        <Button variant="success" type="submit">
                            Offers Recieved
                        </Button> 
                        </Row>
                        </Col>
                    </Col>
                </Col>
            </Row>
            {UserPU && <Popup
                content={<>
                <h1>Edit Personal Info</h1>
            <Form onSubmit={handleSubmitUser}>
                <Row>
                    <Form.Group as={Col} controlId="formUsername">
                        <Form.Label>Edit Username</Form.Label>
                        <Form.Control size='sm' type="text" placeholder="Enter Username" 
                        onChange={ e => setField('formUsername', e.target.value) } />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formFirstName">
                        <Form.Label>Edit First Name</Form.Label>
                        <Form.Control size='sm' type="text" placeholder="Enter First Name" 
                        onChange={ e => setField('formFirstName', e.target.value) } />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formLastName">
                        <Form.Label>Edit Last Name</Form.Label>
                        <Form.Control size='sm' type="text" placeholder="Enter Last Name" 
                        onChange={ e => setField('formLastName', e.target.value) }  />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Edit Email</Form.Label>
                        <Form.Control size='sm' type="email" placeholder="Enter email" 
                        onChange={ e => setField('formGridEmail', e.target.value) } />
                    </Form.Group>
                </Row>

                <Row>

                    <Form.Group as={Col}  controlId="formGridAddress1">
                        <Form.Label>Edit Address</Form.Label>
                        <Form.Control size='sm' placeholder="1234 Main St" 
                        onChange={ e => setField('formGridAddress1', e.target.value)}/> 
                    </Form.Group>

                    <Form.Group as={Col}  controlId="formGridAddress2">
                        <Form.Label>Edit Address 2</Form.Label>
                        <Form.Control size='sm' placeholder="Apartment, studio, or floor" 
                        onChange={ e => setField('formGridAddress2', e.target.value) }/>
                    </Form.Group>

                    </Row>
                    <Row>

                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Edit City</Form.Label>
                        <Form.Control size='sm' placeholder='eg. Saskatoon' 
                        onChange={ e => setField('formGridCity', e.target.value) } />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Edit Province</Form.Label>
                        <Form.Control size='sm' placeholder='eg. Saskatchewan' 
                        onChange={ e => setField('formGridState', e.target.value) } />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Edit Zip</Form.Label>
                        <Form.Control size='sm' placeholder='eg. S7N 3CZ' 
                        onChange={ e => setField('formGridZip', e.target.value) } />
                    </Form.Group>
                    
                </Row>

                <Button variant="success" type="submit">Edit</Button>
            
            </Form>
            </>}
      handleClose={toggleUserPU}
    />}
            
        </Container>
    )
}

export default AccountView;