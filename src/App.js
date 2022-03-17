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
import Logout from './components/Logout';
import { LinkContainer } from 'react-router-bootstrap'
import {Wishlist} from './components/Wishlist'



function App() {  
  
  
  const [LoggedIn, setLoggedIn] = useState(0);  //logged in will be set to 1 when the user Logs in.
  const [IsAdmin, setIsAdmin] = useState(0); //if User is Admin Set to 1.

  const [keywordFromHomepage, setKeywordFromHomepage] = useState('');
  const [listingID, setListingID] = useState('');

 

  let props = {
    login : setLoggedIn,
    Admin : setIsAdmin,
    }

  
  
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
        <Route exact path='/Login' element={<Login set = {setLoggedIn} admin = {setIsAdmin} />} />
        <Route exact path='/signup' element={<Register/>} />
        <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
        {/* <Route path='/search/:keywordFromHomepage' component={keywordFromHomepage}/> */}
        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
        <Route exact path='/listing/:listingID' element={<ListingView/>} component={listingID}/>
        <Route path='/user/wishlist' element={<Wishlist/>}/>
        </Routes>)
         : (<Routes>

        
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/logout' element={<Logout  set = {setLoggedIn} admin = {setIsAdmin} />}/>
       
        <Route exact path='/search' element={<Search/>} component={keywordFromHomepage}/>

        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
          <Route exact path='/createlisting' element={<Createlisting/>}/>
          
          <Route exact path='/' element={<Homepage/>} />
         
         
          <Route exact path='/listing/:listingID' element={<ListingView/>} component={listingID}/>
          <Route exact path='/user' element={<AccountView/>} />
          <Route path='/user/wishlist' element={<Wishlist/>}/>
         
          
            
            </Routes>)
    
    } 
        
        
             
         
         
         
         
         
         
         
        
        </p>
        
      </header>
      </Router>
      </div>
  );
}

export default App;

