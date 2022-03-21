import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ListOfListings = (props) => {
    const [listingsList, setListingsList] = useState([]);



    //Component mount and unmount
    useEffect(() => {
        setListingsList([]);
    }, []);
    //component Updata
    useEffect(() => {
        if (props.listings != ""){
            setListingsList(props.listings);
        } else {
            setListingsList([]);
        }
    });

    return(
        <div>
            {
                listingsList.map(element => { 
                    return <div className="text-center">
                        <Link to={'/listing/' + element._id}>{element.title}</Link>
                    </div>
                })
            }
        </div>
    )
}