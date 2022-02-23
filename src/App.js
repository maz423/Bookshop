
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import {Navi} from './components/Navi'
import {Login} from './components/Login';
import {Register} from './components/Register'
import {Homepage} from './components/Homepage'


function App() {  
  
  
 
 

  

  
  
  return (

   

    
    
    
    <div className="App">

    <Navi/>
     

            
      
      
      <header className="App-header">
      
        <p>
        <Router>

        
         
        
             
         <Routes>
         
         <Route exact path='/Login' element={<Login />} />
         <Route exact path='/register' element={<Register/>} />
         <Route exact path='/homepage' element={<Homepage/>} />
         <Route exact path='/signup' element={<Register/>} />
        
       
           </Routes>
         
         
        </Router>
        </p>
        
      </header>
      
      </div>
  );
}

export default App;

