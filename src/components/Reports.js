import React, { useEffect } from 'react';
import {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReportList } from './ReportList';


export const Reports = (props) => {

    const {userID} = useParams();

    const [reportList, setReportList] = useState([]);


useEffect(() => {

    const requestOptions = {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body : JSON.stringify({id : userID})
    };

    fetch('http://localhost:8000/getReports', requestOptions)
    .then((response) => {

        if(response.ok){
            return response.json();
        }
        else{

        }

    })
    .then((data) => {
        setReportList(data);
    })
    .catch((error) => {
        console.log(error);
    })


}, []);


return (

<section className='report-display'>
    <ReportList reports={reportList}/>
</section>


);


}