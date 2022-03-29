import './Report_users.css'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom';
import {Navi} from './Navi.js'
import {Sidebar} from './Sidebar'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { InputGroup } from 'react-bootstrap';


export const Report_users = (props) => {

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  
const navigate = useNavigate();

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
  const {formUsername, reason } = form
  const newErrors = {}
  // name errors
  if ( !formUsername || formUsername === '' ) newErrors.formUsername = ' Username cannot be blank!'
  else if ( formUsername.length > 10 ) newErrors.formUsername = 'Username is too long!'

  if ( !reason || reason === '' ) newErrors.reason = ' Please specify a reason'
  
  

  

  

  

  
  

  return newErrors
}


const handleSubmitClick = (e) => { //handle submit event.
  e.preventDefault();

  const newErrors = findFormErrors()
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      //errors!
      setErrors(newErrors)
    } else {

      //handle submit

      const {formUsername, reason, formDescription} = form;


      const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({username : formUsername, reason : reason, comments : formDescription})
      }

      fetch('http://localhost:8000/reportUser', requestOptions)
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
  

  
}
        

return (

  
<div className="mb-3">



<Form onSubmit={handleSubmitClick}>
  <Row >
    <Form.Group as={Col} controlId="formUsername">
      <Form.Label>Report User</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Username of user to report" onChange={ e => setField('formUsername', e.target.value) } isInvalid={ !!errors.formUsername } />
      <Form.Control.Feedback type='invalid'>
        { errors.formUsername }
    </Form.Control.Feedback>
    </Form.Group>



   
 
 

   
  </Row>

  <div className='report-select'>

  <Form.Select   controlId='reason' onChange={e => setField('reason', e.target.value)} isInvalid={ !!errors.reason }  aria-label="Default select example" size='sm' >
  <option value= ''> Please choose a reason for reporting user:</option>
  <option value='This user has been posting spam'>This user has been posting spam</option>
  <option value='This user has been posting inappropriate content'>This user has been posting inappropriate content</option>
  <option value='This user has been posting stolen books'>This user has been posting stolen books</option>
  {/* <option value='This listing is Spam'>This listing is Spam</option>
  <option value='Listing contains inappropriate content'>Listing contains inappropriate content</option>
  <option value='Listing is from a stolen book'>Listing is from a stolen book</option> */}
  <Form.Control.Feedback type='invalid'>
        { errors.reason }
    </Form.Control.Feedback>
  </Form.Select>
  </div>

   <Row>
   <InputGroup>
    <InputGroup.Text>Comments:</InputGroup.Text>
    <Form.Control id="formDescription" as="textarea" aria-label="With textarea"  />
  </InputGroup>
   

   

    


   </Row>


  

  

  

 

  

  <Button variant="success" type="submit">
    Report
  </Button> 
</Form>
  


</div>











);


}