import { useState } from "react";

export function ImageEditForm() {
    const [imageId, setImageId] = useState("");
    const [imageName, setImageName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit() {
        setIsLoading(true);
        // Add your fetch code here...

        setImageId("");
        setImageName("");
        setIsLoading(false);
    }

    async function handleSubmit() {
        if (!imageId || !imageName) {
            alert("Both Image ID and New Image Name are required.");
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: imageName })
            });
    
            if (response.ok) {
                alert("Image name updated successfully!");
            } else if (response.status === 404) {
                alert("Error: Image not found.");
            } else if (response.status === 400) {
                alert("Error: Missing name property.");
            } else {
                alert("Error: Something went wrong.");
            }
        } catch (error) {
            console.error("Error updating image name:", error);
            alert("Network error or server unreachable.");
        } finally {
            setImageId("");
            setImageName("");
            setIsLoading(false);
        }
    }

    return (
        <div>
            <label style={{ display: "block" }}>
                Image ID
                <input
                        value={imageId}
                        disabled={isLoading}
                        onChange={(e) => setImageId(e.target.value)}
                />
            </label>
            <label style={{ display: "block" }}>
                New image name
                <input
                        value={imageName}
                        disabled={isLoading}
                        onChange={(e) => setImageName(e.target.value)}
                />
            </label>
            <button disabled={isLoading} onClick={handleSubmit}>Send request</button>
        </div>
    );
}