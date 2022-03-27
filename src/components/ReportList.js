import './Report.css';
import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import RangeSlider from 'react-bootstrap-range-slider';
import ReactDOM from 'react-dom';
import { ListOfListings } from './ListOfListings';
import { MiniReport } from './MiniReport';




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const ReportList = (props) => {

const [ListofReports,setListofReports] = useState(0);






const handleResolve = (e) => {
       
       e.preventDefault();

       
}


   



return (

<div className='reportList'>
{
                ListofReports.map(element => { 
                    return <div className="text-center">
                        <MiniReport/>
                    </div>
                })
            }
       
       
</div>

      

);


}