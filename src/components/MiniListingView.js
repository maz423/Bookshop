import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

export const MiniListingView = (props) => {
    const [image, setImage] = useState();
    const [link, setLink] = useState('');
    const [title, setTitle] = useState('');


    const fetchIamge = async () => {
        const imageURL = "http://localhost:8000/image/" + props.listing._id + "/" + props.listing.imageNames[0];
        const res = await fetch(imageURL);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImage(imageObjectURL);
    }

    useEffect(() => {
        setLink('/listing/' + props.listing._id);
        setTitle(props.listing.title);
        fetchIamge();
    }, []);

    return (
        <div className="text-center">
            <Link to={link}>{title}</Link>
            <img src = {image} alt="icons"/>
        </div>   
    )
}