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
import React, { useEffect } from 'react';
import {Report_users} from './components/Report_users'
import { SearchUser } from './components/SearchUser';
import { UserView } from './components/UserView';
import {Mini_ListofUsers} from './components/Mini_ListofUsers'






function App() {  
  
  
  const [LoggedIn, setLoggedIn] = useState(0);  //logged in will be set to 1 when the user Logs in.
  const [IsAdmin, setIsAdmin] = useState(0); //if User is Admin Set to 1.

  const [keywordFromHomepage, setKeywordFromHomepage] = useState('');
  const [listingID, setListingID] = useState('');
  



// window.onunload = () => {
//     // Clear the local storage
//     window.localStorage.clear()
//  } 
  

//for loading state once when app restarts.
 useEffect(() => {
   const loginURL = 'http://localhost:8000/isLoggedIn';
   const requestOptions = {
      credentials: 'include',
      method: 'GET',
   }
   fetch(loginURL, requestOptions)
   .then((response) => {
     if (!response.ok){
       setLoggedIn(false);
       setIsAdmin(false);
     }
     else {
       //Todo check for admin
       setLoggedIn(true);
     }
   })
   .catch((err) => {
    setLoggedIn(false);
    setIsAdmin(false);
   });
//   try {
//     const serializedState = sessionStorage.getItem('Login');
//     const serializedState2 = sessionStorage.getItem('Admin');
//     if(serializedState === null){
//         return undefined;
//     }
//     if(serializedState2 === null){
//       return undefined;
//   }
//     setLoggedIn(serializedState)
//     setIsAdmin(serializedState2)
    
// } catch (err) {
//     return undefined;
// }
  

}, [])


//saving state whenever change is detected.
useEffect(() => {
  
  try{
    // const serializedState = LoggedIn.toString();
    
    sessionStorage.setItem('Login', LoggedIn );
    sessionStorage.setItem('Admin', IsAdmin );
    
} catch (err){
    return undefined;
}

}, [LoggedIn,IsAdmin])





 

  let props = {
    login : setLoggedIn,
    Admin : setIsAdmin,
    }

  
  
  return (

   
  
    
    
    
    <div className="App">

    <Router>
     {LoggedIn == 0
    ? <Navi set = {setLoggedIn}/>
    : <Login_Nav admin = {IsAdmin}/>
    
    } 
      
   
    
    <div className='test'>

      <Routes>
      <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
      <Route exact path='/SearchUser' element={<SearchUser/>} />
      <Route exact path='/viewUsers' element={<Mini_ListofUsers/>} />
      
      </Routes>
      
    </div>
      

    
     

            
      
      
      <header className="App-header">

    
       
        <p>

       
        
        {LoggedIn == 0
        ? ( 

          
        <Routes>
        <Route exact path='/registerBookStore' element={<RegisterbookStore/>} />
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/Login' element={<Login set = {setLoggedIn} admin = {setIsAdmin} />} />
        <Route exact path='/signup' element={<Register/>} />
        <Route exact path='/viewUser' element={<UserView/>} />
        
        
        
        

       
       
        <Route path='/search/:keywordFromHomepage' component={keywordFromHomepage}/>
        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
        <Route exact path='/listing/:listingID' element={<ListingView/>} component={listingID}/>
        <Route exact path='/wishlist' element={<Wishlist/>}/>
        </Routes>)
         : (<Routes>

        
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/logout' element={<Logout  set = {setLoggedIn} admin = {setIsAdmin} />}/>
       
        {/* <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/> */}

        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
          <Route exact path='/createlisting' element={<Createlisting/>}/>
          <Route exact path='/report' element={<Report_users/>} />
          <Route exact path='/' element={<Homepage/>} />
         
         
          <Route exact path='/listing/:listingID' element={<ListingView/>} component={listingID}/>
          <Route exact path='/user' element={<AccountView/>} />
          <Route exact path='/wishlist' element={<Wishlist/>}/>
         
          
            
            </Routes>)
    
    } 
        
        
             
         
         
         
         
         
         
         
        
        </p>
        
      </header>
      </Router>
      </div>
  );
}

export default App;

