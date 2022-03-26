import React, { useState, useEffect } from 'react';
import { MiniListingView } from './MiniListingView';

export const ListOfListings = (props) => {
    const [listingsList, setListingsList] = useState([]);

    const MyListings = props.MyListings

    
    

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
    },[props.listings]);

    

    return(
        <div>
            {
                listingsList.map(element => { 
                    return <div className="text-center">
                        <MiniListingView listing={element} MyListings = {MyListings} />
                    </div>
                })
            }
        </div>
    )
}