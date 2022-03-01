import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button'
import { useNavigate } from "react-router-dom";
import { isAccordionItemSelected } from 'react-bootstrap/esm/AccordionContext';
import "./Createlisting.css"

function Createlisting(){
    
    const navigate = useNavigate();

     //The info that will be posted into the database 
     const [textname, settextName] = useState('')
     const [condition, setCondition] = useState('');
     const [description, setDescription] = useState('')

    //After the button is clicked the the information stored in textname and description will be sent to the database.
    //NOT TESTING CONDITION YET.  
    const handleClick = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify({textname: textname, description:description})
        };
        
        fetch('http://localhost:8000/make-lis', requestOptions)
        .then(() => {
            alert("sent");
        }).catch( (error)=>{
            alert(error)
        });
        navigate("/homepage");
    }

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
        
    <div className="Container">
        
        <div className="listing-form">
            <input type="text" name="Name" placeholder="Name of textbook" onChange={(e) =>{
                    settextName(e.target.value)

            }}/>
        </div>
        <div className="condition-form">

            <label>New </label>
            <label class="custom-radio-button">    
                <input type="radio" 
                checked={condition === "New"}
                value ="New"
                onChange={(e)=>{setCondition(e.target.value)}}/>
            </label>    
            <label class="custom-radio-button"> 
                <label>Used </label>
                <input type="radio" 
                checked={condition === "Used"}
                value ="Used"
                onChange={(e)=>{setCondition(e.target.value)}}/>
            </label>    
        </div>
        <div className="form-description">
            <textarea name="description" placeholder="Description...." rows="10" cols="30" onChange={(e)=>{
                setDescription(e.target.value)
          }}></textarea>

         </div>  
        <div className="form-post">
            <button onClick={handleClick} type="button" name="POST">POST</button>
        </div>
        <div className="form-image" div/>
          {/* TESTING USAGE this will display the content of the listing database val.textname and val.description is the actually value we want to display*/}
        {/*<div className="form-display">
            <h1>DIsplay</h1>
            {listingList.map((val)=>{
                return <h1>MovieNames:{val.textname}| Description:{val.description}</h1>
            })}
        </div>*/}
     
    </div>
    );
}

export default Createlisting;
