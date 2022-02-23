
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//Wasn't working with .js
//If issues arise, need to use npm install -S if a package is missing
import {Login} from './components/Login.js'
//import {Register} from './components/Register.js';


function App() {  
  
  
 
  

  

  
  
  return (

    

    
    <div className="App">

            
      
      
      <header className="App-header">
      
        <p>
        <Router>

        
         
        
             
         <Routes>
         
         <Route exact path='/' element={<Login />} />        
       
           </Routes>
         
         
        </Router>
        </p>
        
      </header>
      
      </div>
  );
}

export default App;

