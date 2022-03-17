import React, { useState } from 'react';
import "./StarRating.css"
import {FaStar} from 'react-icons/fa';

//Purpose of this class is for buyers to rate the user's or companies rating

const StarRating = (user) =>{
    const [rating, setRating] = useState(null);
    const [hover, setHover ] = useState(null);

    return(
        <div className="Star-RatingInput">
            {[...Array(5)].map((star,i) =>{
                const ratingValue = i +1;

                return  (
                <label> 
                    <input type="radio" name="rating" value={ratingValue} onClick={()=>setRating(ratingValue)} />
                    <FaStar className= "Star" 
                    color={ratingValue <= (hover|| rating)  ? "#ffc107" : "#008000"}size={15}
                    onMouseEnter={() => setHover(ratingValue)} 
                    onMouseLeave={() => setHover(null)}
                    />
                </label>
                );
            })}
           
        </div>
    );
};

export default StarRating;