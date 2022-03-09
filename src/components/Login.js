
import './Login.css';
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const Login = (props) => {

const [ID,setID] = useState('');
const [password,setPassword] = useState('');
const [role,setRole] = useState('staff'); 


const navigate = useNavigate();

const handleSubmitClick = (e) => { //handle submit event.
  e.preventDefault();
  const requestOptions = {
    credentials: 'include',
    method: 'POST',
    headers: {'Content-Type' : 'application/json'},
    body : JSON.stringify({username : e.target.ID.value, password : e.target.password.value})
  };

  fetch('http://localhost:8000/login', requestOptions)
  .then((response) => {
    if (!response.ok){
      console.log("error");
    } else{
      console.log(response);
      props.set(1);
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
           <option value= 'Admin'>  Admin  </option>  
           <option value= 'User'>  User </option>
           <option value= 'Bookstore'>  Bookstore </option> 

           
     
     </select><br></br> <br></br>
      <Button variant="success" size='sm' type="submit">Login</Button>  
     
     </form>

     

     <Link to="/register">   <Button variant="link" size='sm' className='register-btn'> New user ? Register</Button>   </Link>
    
</div>
);


}