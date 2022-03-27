
import './Login.css';
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Alert } from 'bootstrap';

export const Login = (props) => {

const [ID,setID] = useState('');
const [password,setPassword] = useState('');
const [role,setRole] = useState('User'); 


const navigate = useNavigate();

const handleSubmitClick = (e) => { //handle submit event.
  e.preventDefault();
  const body = { 
    username : e.target.ID.value,
    password : e.target.password.value,
    accountType : role,
  }
  const requestOptions = {
    credentials: 'include',
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body : JSON.stringify(body)
  };

  fetch('http://localhost:8000/login', requestOptions)
  .then((response) => {
    if (!response.ok){
      console.log("error");
      alert("Invalid id or password");
    } else{
      console.log(response);
      if(role == 'Admin'){
        alert("Login as Admin Successfull");
        console.log(props);
        
        
        props.set(1);
        props.admin(1);
        props.bookstore(0);
        
        
       
        
      }
      else if (role == 'User'){
        
        alert("Login as User Successfull");
        props.set(1);
        props.admin(0);
        props.bookstore(0);
        
        
        
      }
      else{
        alert("Login as Store Successfull");
        props.set(1);
        props.bookstore(1);
        props.admin(0);
        

      }
      
      navigate("/");
      
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

   



return (
<div className='Login'>
<p className='para'>
{/* <h3 className='welcome'> Welcome to Bookshop. </h3> */}

        
        <h1 className='prompt'>Please Login with your registered ID and Password to continue.</h1>
    </p>  
    <form className='form' onSubmit={handleSubmitClick}>

   
      
      <label for="ID">User ID : &nbsp;&nbsp;&nbsp;&nbsp;      </label>
      <input type="text" id="ID" value={ID} onChange={(e)=>setID(e.target.value)} name="User ID"></input><br></br><br></br>
      <label for="password">Password : &nbsp;</label>
      <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} name="password"></input><br></br><br></br>
      <label for="role">Role:</label>&nbsp;
      <select value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value= 'User'>  User </option>
           <option value= 'Admin'>  Admin  </option>  
           <option value= 'Bookstore'>  Bookstore </option> 

           
     
     </select><br></br> <br></br>
      <Button variant="success" size='sm' type="submit">Login</Button>  
     
     </form>

     

     <Link to="/signup">   <Button variant="link" size='sm' className='register-btn'> New user ? Register</Button>   </Link>
    
</div>
);


}