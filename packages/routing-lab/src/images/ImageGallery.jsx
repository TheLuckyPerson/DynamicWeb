import { MainLayout } from "../MainLayout.jsx";
import "./ImageGallery.css";
import { Link } from "react-router-dom";
import { ImageUploadForm } from "./ImageUploadForm";

export function ImageGallery(props) {
    const imageElements = props.fetchedImages.map((image) => {
        // Check if the image source starts with /uploads/
        const imageSrc = image.src.startsWith('/uploads/') ? `${image.src}` : image.src;
    
        return (
            <div key={image._id} className="ImageGallery-photo-container">
                <Link to={"/images/" + image._id}>
                    <img src={imageSrc} alt={image.name} />
                </Link>
            </div>
        );
    });
    return (
        <>
            <h2>Image Gallery</h2>
            {props.isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>

            <h3>Image Upload</h3>
            <ImageUploadForm authToken={props.authToken}/>
        </>
    );
}
