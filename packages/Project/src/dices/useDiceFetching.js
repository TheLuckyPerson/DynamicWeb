import { useEffect, useState } from "react";

/**
 * Fetches Dices based on username from the authToken. Returns an object with two properties: isLoading and fetchedDices,
 * which will be an array of ImageData.
 *
 * @param diceName {string} the image ID to fetch, or all of them if empty string
 * @param authToken {string} the authorization token to extract the username
 * @returns {{isLoading: boolean, fetchedDices: DiceData[]}} fetch state and data
 */
export function useDiceFetching(diceName, authToken) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedDices, setFetchedDices] = useState([]);

    const getUserFromToken = () => {
        try {
            const decodedToken = JSON.parse(atob(authToken.split('.')[1])); 
            return decodedToken.username; 
        } catch (e) {
            console.error("Error decoding token:", e);
            return null;
        }
    };

    useEffect(() => {
        const fetchDices = async () => {
            try {
                console.log("trying for diceName: " +  diceName)
                const response = await fetch(`/api/Dices?${diceName ? `&name=${diceName}` : ""}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,  
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Dices");
                }

                const data = await response.json();
                console.log(data);
                setFetchedDices(data);
            } catch (error) {
                console.error("Error fetching Dices:", error);
                setFetchedDices([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (authToken) {
            fetchDices();
        } else {
            setIsLoading(false);
        }
    }, [diceName, authToken]);

    return { isLoading, fetchedDices };
}
