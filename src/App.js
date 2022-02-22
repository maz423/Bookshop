
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



import {Login} from './components/Login';
import {Register} from './components/Register'


function App() {  
  
  
 
  

  

  
  
  return (

    

    
    <div className="App">

            
      
      
      <header className="App-header">
      
        <p>
        <Router>

        
         
        
             
         <Routes>
         
         <Route exact path='/' element={<Login />} />
         <Route exact path='/register' element={<Register/>} />
        
       
           </Routes>
         
         
        </Router>
        </p>
        
      </header>
      
      </div>
  );
}

export default App;

