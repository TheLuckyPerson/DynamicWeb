import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";
import { RegisterPage } from "./auth/RegisterPage.jsx";
import { LoginPage } from "./auth/LoginPage.jsx";
import { ProtectedRoute } from "./auth/ProtectedRoute"; // Import the ProtectedRoute

function App() {
    const [userName, setUserName] = useState('');
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const { isLoading, fetchedImages } = useImageFetching("", authToken);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route
                        index
                        element={
                            <ProtectedRoute authToken={authToken} >
                                <Homepage userName={userName} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="account"
                        element={
                            <ProtectedRoute authToken={authToken} >
                                <AccountSettings userName={userName} setUserName={setUserName} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="images"
                        element={
                            <ProtectedRoute authToken={authToken} >
                                <ImageGallery fetchedImages={fetchedImages} isLoading={isLoading} authToken={authToken} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="images/:imageId"
                        element={
                            <ProtectedRoute authToken={authToken} >
                                <ImageDetails authToken={authToken}/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="register" element={<RegisterPage setAuthToken={setAuthToken} />} />
                    <Route path="login" element={<LoginPage setAuthToken={setAuthToken} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
