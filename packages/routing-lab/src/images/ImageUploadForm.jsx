import { useId, useState } from 'react';

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(file);
    });
}

function useActionState() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const action = async (callback) => {
        setIsLoading(true);
        setError(null);
        try {
            await callback();
        } catch (err) {
            setError("An error occurred during the upload. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, action };
}

export function ImageUploadForm({ authToken }) {
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [imageName, setImageName] = useState('');
    const [file, setFile] = useState(null);
    const [formError, setFormError] = useState(null);
    const fileInputId = useId();
    const { isLoading, error, action } = useActionState();

    // Get the author from the authToken (assuming the token has user information)
    const getAuthorFromToken = () => {
        try {
            const decodedToken = JSON.parse(atob(authToken.split('.')[1])); // Decode JWT token
            return decodedToken.username; // Assuming 'username' is in the decoded token
        } catch (e) {
            console.error("Error decoding token:", e);
            return null;
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                const dataUrl = await readAsDataURL(selectedFile);
                setImageDataUrl(dataUrl);
                setFile(selectedFile);
                setFormError(null);
            } catch (err) {
                console.error("Error reading file:", err);
            }
        }
    };

    const handleUpload = async () => {
        if (!file || !imageName.trim()) {
            setFormError("Both the image and title are required.");
            return;
        }
    
        const author = getAuthorFromToken(); // Get the author's username from the token
    
        if (!author) {
            setFormError("Unable to retrieve author information.");
            return;
        }
    
        const formData = new FormData();
        formData.append('image', file); 
        formData.append('name', imageName); 

        try {
            const response = await fetch("/api/images", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });
    
            if (!response.ok) {
                const errorMessage = response.status === 401 ? "Unauthorized" : "Failed to upload image.";
                setFormError(errorMessage);
                return;
            }
    
            const newImage = await response.json();
            console.log("Uploaded image:", newImage);
    
            setImageDataUrl(null);
            setImageName('');
            setFile(null);
            alert('Image uploaded successfully!');
        } catch (error) {
            setFormError("Network error. Please try again.");
            console.error(error);
        }
    };
    

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div>
                <label htmlFor={fileInputId}>Choose image to upload: </label>
                <input
                    id={fileInputId}
                    name="image"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <label>
                    <span>Image title: </span>
                    <input
                        name="name"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                    />
                </label>
            </div>

            <div>
                {imageDataUrl && (
                    <img
                        style={{ maxWidth: "20em" }}
                        src={imageDataUrl}
                        alt="Preview"
                    />
                )}
            </div>

            <div>
                {formError && <p style={{ color: "red" }}>{formError}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <button onClick={() => action(handleUpload)} disabled={isLoading}>
                {isLoading ? "Uploading..." : "Confirm upload"}
            </button>
        </form>
    );
}
