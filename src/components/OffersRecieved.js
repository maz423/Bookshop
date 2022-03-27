import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {faCode} from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Container } from 'react-bootstrap';
import { Popover } from 'react-bootstrap';

function OffersRecieved (params){

    const { userID } = useParams();

    //Will I need this? 
    const [name, setName ] = useState(''); //For now, if the offer was a guest it will just display 
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [offers, setOffers] = useState({
        loading: false,
        data: [],
        error: false,
    });

    const [image, setImage] = useState();

    useEffect(() => {
        const listingURL = 'http://localhost:8000/get-offers';
        //console.log(listingURL);
        const requestOptions = {
            credentials: 'include',
            method: 'GET',
            headers: {'Content-Type' : 'application/json'},
        };

        fetch(listingURL, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
            }
        })
        .then((data) => {
            console.log(data);
            setOffers({
                loading:false,
                data: data,
                error: false
            })
        })
        .catch((error) =>{
            console.log(error);
            setOffers({
                loading: false,
                data: [],
                error: true
            })
        });
    }, []);

    let content = null;

    if (offers.error ){
        content = <p>
            There was an error attempting to grab the offers.
            </p>
    }

    if(offers.data){
        console.log("here");
        console.log(offers.data);



        content = offers.data.map((offers, key)=>
            <div key={key}>
                <Container fluid="lg">

                <Row>
                <p>{offers.title}</p>
                <p>{offers.email}</p> 
                <p>{offers.phone_number}</p>
                <p>{offers.guest}</p>
                </Row>
                {
            <Popover id="popover-basic">
              <Popover.Header as="h3">Description</Popover.Header>
              <Popover.Body>
                {offers.offer}
              </Popover.Body>
            </Popover>
                }
                <Button>Decline </Button>
                </Container>

            </div>
        );
    } 

    return (
        <div ClassName="Offers-Recieved">
            <h1 className="No"
            >My Offers</h1>
            {content}
        </div>
    )
}


export default OffersRecieved;

