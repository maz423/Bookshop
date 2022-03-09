import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';


import {Navi} from './components/Navi.js'
import {Login} from './components/Login.js';
import {Register} from './components/Register.js'
import {Homepage} from './components/Homepage.js'
import {RegisterbookStore} from './components/RegisterbookStore'
import {Search} from './components/Search'
import {AdvancedSearch} from './components/AdvancedSearch'
import {Login_Nav} from './components/Login_Nav'
import Createlisting from './components/Createlisting';
import {ListingView} from './components/ListingView';
import AccountView from './components/AccountView';
import { LinkContainer } from 'react-router-bootstrap'



function App() {  
  
  
  const [LoggedIn, setLoggedIn] = useState(0);  //logged in will be set to 1 when the user Logs in.
  const [IsAdmin, setIsAdmin] = useState(0); //if User is Admin Set to 1.
 

  

  
  
  return (

   
  
    
    
    
    <div className="App">

    <Router>
     {!LoggedIn
    ? <Navi set = {setLoggedIn}/>
    : <Login_Nav admin = {IsAdmin}/>
    
    } 
      
   
    

      

    
     

            
      
      
      <header className="App-header">

    
       
        <p>
        
        {!LoggedIn
        ? ( 
        <Routes>
        <Route exact path='/registerBookStore' element={<RegisterbookStore/>} />
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/Login' element={<Login set = {setLoggedIn}/>} />
        <Route exact path='/signup' element={<Register/>} />
        <Route exact path='/search' element={<Search/>} />
        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
        </Routes>)
         : (<Routes>

        
        <Route exact path='/' element={<Homepage/>} />
        
       
        <Route exact path='/search' element={<Search/>} />
        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
          <Route exact path='/createlisting' element={<Createlisting/>}/>
          
          <Route exact path='/' element={<Homepage/>} />
         
         
          <Route exact path='/listing/:listingID' element={<ListingView/>}/>
          <Route exact path='/user' element={<AccountView/>} />
         
          
            
            </Routes>)
    
    } 
        
        
             
         
         
         
         
         
         
         
        
        </p>
        
      </header>
      </Router>
      </div>
  );
}

export default App;

