import React from 'react';
import "./StarRating.css";
import {FaStar,} from 'react-icons/fa';

//Purpose of this class grabbing the user's or companies rating 

const StarRatingGrab = (user) =>{
    return(
        <div className="Star-Rating">
            {[...Array(5)].map((star) =>{
                return  <FaStar size={15}/>
            })}
           
        </div>
    );
};

export default StarRatingGrab;