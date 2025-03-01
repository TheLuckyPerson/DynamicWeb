import { MainLayout } from "../MainLayout.jsx";
import "./ImageGallery.css";
import { Link } from "react-router-dom";

export function ImageGallery(props) {
    const imageElements = props.fetchedImages.map((image) => (
        <div key={image.id} className="ImageGallery-photo-container">
            <Link to={"/images/" + image.id}>
                <img src={image.src} alt={image.name} />
            </Link>
        </div>
    ));
    return (
        <>
            <h2>Image Gallery</h2>
            {props.isLoading && "Loading..."}
            <div className="ImageGallery">
                {imageElements}
            </div>
        </>
    );
}
