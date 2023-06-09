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

import MyListings from './components/MyListings';
import {Report} from './components/Report';
import {Reports} from './components/Reports';
import {Lost} from './components/Lost'
import OffersRecieved from './components/OffersRecieved.js'
import { BookstoreView } from './components/BookstoreView';







function App() {  
  
  
  const [LoggedIn, setLoggedIn] = useState(0);  //logged in will be set to 1 when the user Logs in.
  const [IsAdmin, setIsAdmin] = useState(0); //if User is Admin Set to 1.
  const [BookStore, setbookStore] = useState(0);

  const [keywordFromHomepage, setKeywordFromHomepage] = useState('');
  const [listingID, setListingID] = useState('');
  const [bookstoreID, setBookstoreID] = useState('');
  const [username, setUsername] = useState('');
  
  

//for loading state once when app restarts.
 useEffect(() => {
  try {
    const serializedState = sessionStorage.getItem('Login');
    const serializedState2 = sessionStorage.getItem('Admin');
    const serializedState3 = sessionStorage.getItem('Bookstore');
    if(serializedState === null){
        return undefined;
    }
    if(serializedState2 === null){
      return undefined;

    
  }

  if(serializedState3 === null){
    return undefined;
  }
    setLoggedIn(serializedState)
    setIsAdmin(serializedState2)
    setbookStore(serializedState3)

    
} catch (err) {
    return undefined;
}
  

}, [])


//saving state whenever change is detected.
useEffect(() => {
  
  try{
    // const serializedState = LoggedIn.toString();
    
    sessionStorage.setItem('Login', LoggedIn );
    sessionStorage.setItem('Admin', IsAdmin );
    sessionStorage.setItem('Bookstore', BookStore );

    
} catch (err){
    return undefined;
}

}, [LoggedIn,IsAdmin,BookStore])





 

  let props = {
    login : setLoggedIn,
    Admin : setIsAdmin,
    }

  
  
  return (

   
  
    
    
    
    <div className="App">

    <Router>

    {LoggedIn == 0 && IsAdmin == 0 && BookStore == 0    //render different dropdowns based on type of user
    ? <Navi set = {setLoggedIn}/>
    : <></>
    
    } 

     {LoggedIn == 1 && IsAdmin == 0 && BookStore == 0
    ? <Login_Nav admin = {IsAdmin} bookstore = {BookStore}/>
    : <></>
    
    } 

    {IsAdmin == 1 && LoggedIn == 1 && BookStore == 0
    ? <Login_Nav admin = {IsAdmin} bookstore = {BookStore}/>
    : <></>
    
    } 

   {IsAdmin == 0 && LoggedIn == 1 && BookStore == 1
    ? <Login_Nav admin = {IsAdmin} bookstore = {BookStore}/>
    : <></>
    
    } 
      
   
    
    <div className='test'>
    
    {LoggedIn == 0 && IsAdmin == 0 && BookStore == 0 //Routes if user is not logged in.
    ? <Routes>
    <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
    
    </Routes>
    : <></>
    
    } 

   {LoggedIn == 1 && IsAdmin == 0 && BookStore == 0  //Routes for Basic User
    ? <Routes>
    
    <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
    <Route exact path='/Mylistings' element={<MyListings  bookstore = {0} user = {1}/>}/>
    <Route exact path='/wishlist' element={<Wishlist/>}/>
    
    
    </Routes>
    : <></>
    
    } 

   {IsAdmin == 1 && LoggedIn == 1 && BookStore == 0   //Routes for  Admin
    ? <Routes>
    <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
    <Route exact path='/SearchUser' element={<SearchUser/>} />
    
    {/* <Route exact path='/viewUsers' element={<Mini_ListofUsers/>} /> */}
    
    
    </Routes>
    : <></>
    
    } 

   {IsAdmin == 0 && LoggedIn == 1 && BookStore == 1   //Routes for  Bookstore
    ? <Routes>
    <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/>
    <Route exact path='Mylistings' element={<MyListings bookstore = {1} user = {0} />}/>
    
    
    
    {/* <Route exact path='/viewUsers' element={<Mini_ListofUsers/>} /> */}
    
    
    </Routes>
    : <></>
    
    } 

    

      
      
    </div>
      

    
     

            
      
      
      <header className="App-header">

    
       
        <p>
          

        
        {LoggedIn == 0 && IsAdmin == 0 && BookStore == 0 //Routes if user is not logged in.
        ? (<Routes>
           <Route exact path='/registerBookStore' element={<RegisterbookStore/>} />
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/Login' element={<Login set = {setLoggedIn} admin = {setIsAdmin} bookstore = {setbookStore}/>} />
        <Route exact path='/signup' element={<Register/>} />
        <Route exact path='/search/:keywordFromHomepage' />
        <Route exact path='/report' element={<Report/>} />
        
        
        
        

       
       
        <Route path='/search/:keywordFromHomepage' component={keywordFromHomepage}/>
        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
        <Route exact path='/listing/:listingID' element={<ListingView update = {0} loggedIn={0}/>} component={listingID} update = {0}/>
        <Route exact path='/bookstore/:bookstoreID' element={<BookstoreView/>} component={bookstoreID}/>
        
        <Route exact path='/wishlist' element={<Wishlist/>}/>
        <Route path='/*' element={<Lost/>}/>

    
    
         </Routes>)
        : <></>
    
         } 

       {LoggedIn == 1 && IsAdmin == 0 && BookStore == 0    //Routes for Basic User
       ? (<Routes>
        <Route exact path='/' element={<Homepage/>} />
        <Route exact path='/logout' element={<Logout  set = {setLoggedIn} admin = {setIsAdmin} bookstore = {setbookStore} />}/>
       
        {/* <Route exact path='/search/:keywordFromHomepage' element={<Search/>} component={keywordFromHomepage}/> */}

        <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
          <Route exact path='/createlisting' element={<Createlisting update = {0}/>}/>
          
          <Route exact path='/report' element={<Report_users/>} />
          <Route exact path='/' element={<Homepage/>} />
          
         
         
          <Route exact path='/listing/:listingID' element={<ListingView update = {0} wish = {0} loggedIn={1} bookstore={0} admin = {0}/>} component={listingID}  />
          <Route exact path='/user' element={<AccountView bookstore = {0}/>} />
          
          
          <Route exact path='update/:listingID' element={<ListingView update = {1} wish = {0} loggedIn={1} bookstore={0} admin = {0} />}/>
          <Route exact path='/wishlistItem/:listingID' element={<ListingView update = {0} wish = {1} loggedIn={1} bookstore={0} admin = {0} />} component={listingID}   />
          <Route exact path='/search/:keywordFromHomepage' />
          <Route exact path='/get-offers' element={<OffersRecieved update = {1} wish = {0} bookstore={0}/>} />
          
          <Route exact path='/bookstore/:bookstoreID' element={<BookstoreView/>} component={bookstoreID}/>
          <Route exact path='updatelisting/:listingID' element={<Createlisting update = {1}/>}/>
          <Route exact path='/Mylistings'/>
          <Route exact path='/wishlist' />
          
          <Route path='/*' element={<Lost/>}/>
    
        </Routes>)
        : <></>
    
    } 

   {IsAdmin == 1 && LoggedIn == 1 && BookStore == 0           //Routes for  Admin
    ? (<Routes>
       <Route exact path='/' element={<Homepage/>} />
       <Route exact path='/listing/:listingID' element={<ListingView update = {0} wish = {0} loggedIn={1} bookstore={0} admin = {1}/>} component={listingID}  />
       <Route exact path='/logout' element={<Logout  set = {setLoggedIn} admin = {setIsAdmin} bookstore = {setbookStore} />}/>
       <Route exact path='/viewUser' element={<UserView/>} />
       <Route exact path='/viewReports' element={<Reports/>} />
       <Route exact path='/report/:username' element={<Report/>} component={username}/>
       <Route exact path='/search/:keywordFromHomepage' />
       <Route exact path='/SearchUser'  />
       <Route exact path='/bookstore/:bookstoreID' element={<BookstoreView/>} component={bookstoreID}/>
       <Route path='/*' element={<Lost/>}/>
       
    
    </Routes>)
    : <></>
    
    } 

   {IsAdmin == 0 && LoggedIn == 1 && BookStore == 1           //Routes for Bookstore user
    ? (<Routes>
       <Route exact path='/' element={<Homepage/>} />
       <Route exact path='/listing/:listingID' element={<ListingView update = {0} wish = {0} loggedIn={1} bookstore={1} admin = {0} />} component={listingID}  />
       <Route exact path='/logout' element={<Logout  set = {setLoggedIn} admin = {setIsAdmin} bookstore = {setbookStore}/>}/>
       <Route exact path='/createlisting' element={<Createlisting update = {0}/>}/>
       
       <Route exact path='update/:listingID' element={<ListingView update = {1} wish = {0} loggedIn={1} bookstore={1} admin = {0}/>}/>
       <Route exact path='/report' element={<Report_users/>} />
       <Route exact path='/advancedSearch' element={<AdvancedSearch/>} />
       <Route exact path='/listing/:listingID' element={<ListingView update = {0} wish = {0} bookstore={1}/>} component={listingID}  />
       <Route exact path='/search/:keywordFromHomepage' />
       <Route exact path='/user' element={<AccountView bookstore = {1}/>} />
       <Route exact path='/bookstore/:bookstoreID' element={<BookstoreView/>} component={bookstoreID}/>
       <Route exact path='/get-offers' element={<OffersRecieved update = {1} wish = {0} bookstore={1}/>} />
       <Route path='/*' element={<Lost/>}/>
    </Routes>)
    : <></>
    
    } 

    </p>
        
      </header>
      </Router>
      </div>
  );
}

export default App;

