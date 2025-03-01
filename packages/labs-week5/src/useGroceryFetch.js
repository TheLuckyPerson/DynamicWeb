import React, { useEffect, useState, useRef } from "react";
import { groceryFetcher } from "./groceryFetcher";

export function useGroceryFetch(selectedSource) {
    const [groceryData, setGroceryData] = React.useState([]);
    const [isLoading, setLoading] = React.useState(false);
    const [errorMsg, setError] = React.useState(null);
    
    
    useEffect(() => {
        
        let isStale = false
        // console.log("called " + selectedSource)
        async function fetchData(url) {
            isStale = false;
            setGroceryData([]);
            setLoading(true)
            setError(null)
            try {
                const data = await groceryFetcher.fetch(url);
                if (!isStale) {
                    setGroceryData(data);
                }            
            } catch {
                if (!isStale) {
                    setError("Error fetching data.");
                }            
            } finally {
                if (!isStale) {
                    setLoading(false);
                }            
            }
        }

        fetchData(selectedSource);

        return () => {
            isStale = true;
        };
    }, [selectedSource]);

    return {groceryData, isLoading, errorMsg};
}