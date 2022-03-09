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

     //The info that will be posted into the database 
     const [textname, settextName] = useState('')
     const [condition, setCondition] = useState('');
     const [description, setDescription] = useState('')

    //After the button is clicked the the information stored in textname and description will be sent to the database.
    //NOT TESTING CONDITION YET.  

    //ComponentDid mount
    useEffect(() => {
            const requestOptions = {
                credentials: 'include',
                method: 'GET',
                headers: {'Content-Type' : 'application/json'},
              };
              fetch('http://localhost:8000/isUser', requestOptions)
              .then((response) => {
                if (!response.ok){
                    navigate("/Login");
                } else{
                    console.log(response);
                }
              })
              .catch((error) => {
                console.log(error);
                navigate("/Login");
              });
        
    })

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
          address1 : formItems.formGridAddress1.value,
          address2 : formItems.formGridAddress2.value,
          city : formItems.formGridCity.value,
          province : formItems.formGridState.value,
          zipCode : formItems.formGridZip.value,
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

    //THIS IS FOR TESTING PURPOSES getting the data from the listing database and posting on the page 
    //const[listingList,setListinglist] = useState([])
    // useEffect(()=>{
    //     const myRequest = {
    //         method: "GET",
    //         headers: {'Content-Type':'application/json'},
    //     }
    //     fetch('http://localhost:8000/listings',myRequest).then(response => response.json()).then(data=>setListinglist(data)).catch(()=> alert("nope"))
    // },[])


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
    <Form.Control size='sm' placeholder="1234 Main St" />
    </Form.Group>

    <Form.Group as={Col}  controlId="formGridAddress2">
    <Form.Label>Address 2</Form.Label>
    <Form.Control size='sm' placeholder="Apartment, studio, or floor" />
    </Form.Group>

    


   </Row>

   <Row>
      
   <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatoon' />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Provience</Form.Label>
      <Form.Control size='sm' placeholder='eg. Saskatchewan' />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridZip">
      <Form.Label>Zip</Form.Label>
      <Form.Control size='sm' placeholder='eg. S7N 3CZ' />
    </Form.Group>

   </Row>

  

  

  

 

  

  <Button variant="success" type="submit">
    Post
  </Button> 
</Form>

</div>
        
    // <div className="Container">
        
    //     <div className="listing-form">
    //         <input type="text" name="Name" placeholder="Name of textbook" onChange={(e) =>{
    //                 settextName(e.target.value)

    //         }}/>
    //     </div>
    //     <div className="condition-form">
    //         Condition: &nbsp;
    //         <label>New </label>
    //         <label class="custom-radio-button">    
    //             <input type="radio" 
    //             checked={condition === "New"}
    //             value ="New"
    //             onChange={(e)=>{setCondition(e.target.value)}}/>
    //         </label>    
    //         <label class="custom-radio-button"> 
    //             <label>Used </label>
    //             <input type="radio" 
    //             checked={condition === "Used"}
    //             value ="Used"
    //             onChange={(e)=>{setCondition(e.target.value)}}/>
    //         </label>    
    //     </div>
    //     <div className="form-description">
    //         <textarea name="description" placeholder="Description...." rows="10" cols="30" onChange={(e)=>{
    //             setDescription(e.target.value)
    //       }}></textarea>

    //      </div>  
    //     <div className="form-post">
    //         <button onClick={handleClick} type="button" name="POST">POST</button>
    //     </div>
    //     <div className="form-image" div/>
    //       {/* TESTING USAGE this will display the content of the listing database val.textname and val.description is the actually value we want to display*/}
    //     {/*<div className="form-display">
    //         <h1>DIsplay</h1>
    //         {listingList.map((val)=>{
    //             return <h1>MovieNames:{val.textname}| Description:{val.description}</h1>
    //         })}
    //     </div>*/}
     
    // </div>
    );
}

export default Createlisting;
