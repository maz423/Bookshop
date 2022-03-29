import './Report.css';
import React, { useEffect } from 'react';
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
import { Report } from './Report';




import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export const ReportList = (props) => {

const [ListofReports,setListofReports] = useState([]);


useEffect(() => {
    setListofReports([]);
}, []);

useEffect(() => {
    if(props.reports != ""){
        setListofReports(props.reports);
    }
    else{
        setListofReports([]);
    }
}, [props.reports]);






const handleResolve = (e) => {
       
       e.preventDefault();

       
}


   



return (

<div className='reportList'>
{
                // display a report object for each report in ListofReports
                ListofReports.map(element => { 
                    return <div className="text-center">
                        {/* <MiniReport report={element}/> */}
                        <Report report={element}/>
                    </div>
                })
            }
       
       
</div>

      

);


}