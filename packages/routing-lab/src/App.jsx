import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";

function App() {
    const [userName, setUserName] = useState('')
    const { isLoading, fetchedImages } = useImageFetching("");

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Homepage userName={userName} />} />
                    <Route 
                        path="account" 
                        element={<AccountSettings userName={userName} setUserName={setUserName} />} 
                    />
                    <Route path="images" element={<ImageGallery 
                        fetchedImages={fetchedImages}
                        isLoading={isLoading}
                    />} />
                    <Route path="images/:imageId" element={<ImageDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
