import React,{useEffect, useState,Component} from 'react';
import Popup from './Offerpopup.js';
import Button from 'react-bootstrap/Button'
import { useNavigate } from "react-router-dom";
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext';
import "./Createlisting.css"
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'


function Createlisting(){
    
   const [ form, setForm ] = useState({})
   const [ errors, setErrors ] = useState({})
    const navigate = useNavigate();
   

     //The info that will be auto populated when login in
     const [formGridAddress1, setformGridAddress1] = useState('');
     const [address2, setAddress2] = useState('');
     const [formGridCity, setformGridCity] = useState('');
     const [formGridState, setformGridState] = useState('');
     const [formGridZip, setformGridZip] = useState('');

    //After the button is clicked the the information stored in textname and description will be sent to the database.
    //NOT TESTING CONDITION YET.  

    //ComponentDid mount
    useEffect(() => {
      const requestOptions = {
        credentials: 'include',
        method: 'GET',
        headers: {'Content-Type' : 'application/json'},
      };
      const URL = 'http://localhost:8000/user'
      fetch(URL, requestOptions)
      .then((response) => {
        if (!response.ok){
          //navigate("/Login");
        } else{
          return response.json();
      }})
      .then((data) => {
        console.log(data);
        setformGridAddress1(data.address1);
        setAddress2(data.address2);
        setformGridCity(data.city);
        setformGridState(data.province);
        setformGridZip(data.zipcode);
      })
      .catch((error) => {
        console.log(error);
        //navigate("/Login");
      });
        
    }, []);


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
      const {formBookTitle, authorName ,formPrice } = form
      const newErrors = {}
      // name errors
      if ( !formBookTitle || formBookTitle === '' ) newErrors.formBookTitle = ' Bookname cannot be blank!'

      if ( !formPrice || formPrice === '' ) newErrors.formPrice = ' Price cannot be blank!'
      else if ( isNaN(formPrice) ) newErrors.formPrice = ' Price must be a numeric value!'
      
      
      if ( !authorName || authorName === '' ) newErrors.authorName = 'Author  cannot be blank!'
    
      if ( !formGridAddress1 || formGridAddress1 === '' ) newErrors.formGridAddress1 = 'Address feild cannot be blank!'
    
      if ( !formGridCity || formGridCity === '' ) newErrors.formGridCity = 'City cannot be blank!'
    
      if ( !formGridState || formGridState === '' ) newErrors.formGridState = 'Provience feild cannot be blank!'
    
      if ( !formGridZip || formGridZip === '' ) newErrors.formGridZip = 'Zip code cannot be blank!'
      
    
      return newErrors
    }

  //Constant that will check if the popup page is open 
  const [isOpen, setIsOpen] = useState(false);
     
  //This function will open the popup page to make an offer
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  
  //State for the images no file initially selected 
  const [image, setImage]=useState('');
  
  // On file select (from the pop up)
  const onFileChange = (event) => {
    
    // Update the state
    setImage({ image: event.target.files[0] });
  
  };
  
  const handleSubmitClick = (e) => { 
    e.preventDefault();
    togglePopup();
      const newErrors = findFormErrors()

      // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      //errors!
      setErrors(newErrors)
    } else {

        const formItems = e.target.elements;
        //TODO check to ensure price is int
        //TODO File input
        const body = {
          title : formItems.formBookTitle.value,
          authorName : formItems.authorName.value,
          description : formItems.formDescription.value,
          price : formItems.formPrice.value,
          address1 : formItems.formGridAddress1.value,
          address2 : address2,
          city : formItems.formGridCity.value,
          province : formItems.formGridState.value,
          zipCode : formItems.formGridZip.value,
        };
        //Testing for images 
        const requestOptions = {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify(body)
        };
        
        fetch('http://localhost:8000/make-lis', requestOptions)
        .then((response) => {
          if (!response.ok){
            console.log("error sending info");
          } else {
            return response.json();
            //navigate('/')
          }
        })
        .then((data) => {
          //You will have user id here
          console.log(data);
          let directory = "listings"
          
          const formData = new FormData();
          formData.append('id', data);
          formData.append('directory', directory);
          formData.append('file',image);
          const request2Options = {
            credentials: 'include',
            method: 'POST',
            body : formData,
          }

          fetch("http://localhost:8000/uploadImage", request2Options)
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
        })
        .catch( (error)=>{
            console.log(error);
        });
    };
  }

    

    return (  
        
        
  <div className="mb-3">
    
  <Form onSubmit={handleSubmitClick}>
  <Row >
    <Form.Group as={Col} controlId="formBookTitle">
      <Form.Label>Book Title</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Eg. Intro to AI" onChange={ e => setField('formBookTitle', e.target.value) } isInvalid={ !!errors.formBookTitle } />
      <Form.Control.Feedback type='invalid'>
        { errors.formBookTitle }
    </Form.Control.Feedback> 
    </Form.Group>

   <Form.Group as={Col} controlId="authorName">
      <Form.Label>Author</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Name" onChange={ e => setField('authorName', e.target.value) } isInvalid={ !!errors.authorName }/>
      <Form.Control.Feedback type='invalid'>
        { errors.authorName }
    </Form.Control.Feedback> 
    </Form.Group>



    

    <div key='radio' className="cond-radio">

    

      Condition:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Form.Check 
        inline
        label="New"
        name="group1"
        type='radio'
        id= "new"
        
      />
      <Form.Check 
        inline
        label="Used"
        name="group1"
        type='radio'
        
        id="used"
        defaultChecked
      />
      
      
      
    </div>
    

    

    {/* <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control size='sm' type="email" placeholder="Enter email" />
    </Form.Group> */}


   
  </Row>

  <Row>

    
    <Form.Group as={Col} controlId="formFileMultiple" onChange={ e => setImage(e.target.files[0])}>
    <Form.Label>Upload images of the Book</Form.Label>
    <Form.Control type="file" multiple size='sm' />
    </Form.Group>


    <InputGroup as={Col}  >
    
    <InputGroup.Text >$</InputGroup.Text>
    <Form.Control id="formPrice" aria-label="Amount (to the nearest dollar)" onChange={ e => setField('formPrice', e.target.value) } isInvalid={ !!errors.formPrice } />
    <Form.Control.Feedback type='invalid'>
        { errors.formPrice }
    </Form.Control.Feedback> 
    <InputGroup.Text >.00</InputGroup.Text>
    </InputGroup>

    


    

    <InputGroup>
    <InputGroup.Text>Description:</InputGroup.Text>
    <Form.Control id="formDescription" as="textarea" aria-label="With textarea"  />
  </InputGroup>
  </Row>

  
 


  

   <Row>
   

    

    <Form.Group as={Col}  controlId="formGridAddress1">
    <Form.Label>Pick up Address</Form.Label>
    <Form.Control size='sm' placeholder="1234 Main St" value = {formGridAddress1} onChange={ e => setformGridAddress1(e.target.value) } isInvalid={ !!errors.formGridAddress1 }/>
    <Form.Control.Feedback type='invalid'>
        { errors.formGridAddress1 }
    </Form.Control.Feedback> 
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress2">
    <Form.Label>Address 2</Form.Label>
    <Form.Control size='sm' placeholder="Apartment, studio, or floor" value={address2} onChange={(e)=>setAddress2(e.target.value)} />
    </Form.Group>

    


   </Row>

   <Row>
      
   <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatoon' value={formGridCity} onChange={ e => setformGridCity(e.target.value) } isInvalid={ !!errors.formGridCity }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridCity }
    </Form.Control.Feedback> 
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Provience</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatchewan' value={formGridState} onChange={ e => setformGridState(e.target.value) } isInvalid={ !!errors.formGridState }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridState }
    </Form.Control.Feedback> 
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control size='sm' placeholder='eg. S7N 3CZ' value = {formGridZip} onChange={ e => setformGridZip(e.target.value) } isInvalid={ !!errors.formGridZip }/>
      <Form.Control.Feedback type='invalid'>
        { errors.formGridZip }
    </Form.Control.Feedback> 
    </Form.Group>

   </Row>
   {/* {isOpen && <Popup
                content={<>
                  <div>
                  <h2>Details </h2> 
                    <p>File Name: {image.name}</p>
 
             
                    <p>File Type: {image.type}</p>

                  </div>                

            </>}
      handleClose={togglePopup}
    />} */}

  

  <Button variant="success" type="submit">
    Post
  </Button> 
</Form>

</div>
    );
}

export default Createlisting;
