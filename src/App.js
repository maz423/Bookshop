
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';


import {Navi} from './components/Navi.js'
import {Login} from './components/Login.js';
import {Register} from './components/Register.js'
import {Homepage} from './components/Homepage.js'
import {RegisterbookStore} from './components/RegisterbookStore'
import {search} from './components/search'
import {Login_Nav} from './components/Login_Nav'


function App() {  
  
  
  const [LoggedIn, setLoggedIn] = useState(0);  //logged in will be set to 1 when the user Logs in
 

  

  
  
  return (

   
  
    
    
    
    <div className="App">


    {!LoggedIn
    ? <Navi set = {setLoggedIn}/>
    : <Login_Nav/>
    
    }

    
    

      

    
     

            
      
      
      <header className="App-header">
        
        <p>
        <Router>

        
         
        
             
         <Routes>
         
         <Route exact path='/Login' element={<Login />} />
       
      
         <Route exact path='/register' element={<Register/>} />
         <Route exact path='/registerBookStore' element={<RegisterbookStore/>} />
         <Route exact path='/' element={<Homepage/>} />
         <Route exact path='/signup' element={<Register/>} />
         
       
           </Routes>
         
         
        </Router>
        </p>
        
      </header>
      
      </div>
  );
}

export default App;

