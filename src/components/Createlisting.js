import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button'
import { useNavigate } from "react-router-dom";
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext';
import "./Createlisting.css"
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'


function Createlisting(){
    
    const navigate = useNavigate();

     //The info that will be auto populated when login in
     const [address1, setAddress1] = useState('');
     const [address2, setAddress2] = useState('');
     const [city, setCity] = useState('');
     const [province, setProvince] = useState('');
     const [zipcode, setZipcode] = useState('');

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
          navigate("/Login");
        } else{
          return response.json();
      }})
      .then((data) => {
        console.log(data);
        setAddress1(data.address1);
        setAddress2(data.address2);
        setCity(data.city);
        setProvince(data.province);
        setZipcode(data.zipcode);
      })
      .catch((error) => {
        console.log(error);
        navigate("/Login");
      });
        
    }, []);

    const handleSubmitClick = (e) => { 
      e.preventDefault();
        const formItems = e.target.elements;
        //TODO check to ensure price is int
        //TODO File input
        const body = {
          title : formItems.formBookTitle.value,
          authorName : formItems.authorName.value,
          description : formItems.formDescription.value,
          price : formItems.formPrice.value,
          address1 : address1,
          address2 : address2,
          city : city,
          province : province,
          zipcode : zipcode,
        };
        console.log(formItems);
        console.log(body);
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
            navigate('/')
          }
        }).catch( (error)=>{
            console.log(error);
        });
    };

    return (  
        
        
  <div className="mb-3">
  <Form onSubmit={handleSubmitClick}>
  <Row >
    <Form.Group as={Col} controlId="formBookTitle">
      <Form.Label>Book Title</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Eg. Intro to AI" />
    </Form.Group>

   <Form.Group as={Col} controlId="authorName">
      <Form.Label>Author</Form.Label>
      <Form.Control size='sm' type="text" placeholder="Name" />
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
      />
      
      
      
    </div>
    

    

    {/* <Form.Group as={Col} controlId="formGridEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control size='sm' type="email" placeholder="Enter email" />
    </Form.Group> */}


   
  </Row>

  <Row>

    
    <Form.Group as={Col} controlId="formFileMultiple" >
    <Form.Label>Upload images of the Book</Form.Label>
    <Form.Control type="file" multiple size='sm' />
    </Form.Group>


    <InputGroup as={Col} >
    
    <InputGroup.Text>$</InputGroup.Text>
    <Form.Control id="formPrice" aria-label="Amount (to the nearest dollar)"  />
    <InputGroup.Text>.00</InputGroup.Text>
    </InputGroup>

    


    </Row>

    <InputGroup>
    <InputGroup.Text>Description:</InputGroup.Text>
    <Form.Control id="formDescription" as="textarea" aria-label="With textarea" />
  </InputGroup>

  
 


  

   <Row>
   

    

    <Form.Group as={Col}  controlId="formGridAddress1">
    <Form.Label>Pick up Address</Form.Label>
    <Form.Control size='sm' placeholder="1234 Main St" value={address1} onChange={(e)=>setAddress1(e.target.value)}/>
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress2">
    <Form.Label>Address 2</Form.Label>
    <Form.Control size='sm' placeholder="Apartment, studio, or floor" value={address2} onChange={(e)=>setAddress2(e.target.value)} />
    </Form.Group>

    


   </Row>

   <Row>
      
   <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatoon' value={city} onChange={(e)=>setCity(e.target.value)}/>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Provience</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatchewan' value={province} onChange={(e)=>setProvince(e.target.value)}/>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control size='sm' placeholder='eg. S7N 3CZ' value={zipcode} onChange={(e)=>setZipcode(e.target.value)}/>
    </Form.Group>

   </Row>

  

  

  

 

  

  <Button variant="success" type="submit">
    Post
  </Button> 
</Form>

</div>
    );
}

export default Createlisting;
