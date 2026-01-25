/**
 * API Service
 * This file handles all HTTP requests to the backend API.
 * It typically includes a styled Axios instance or fetch wrappers with interceptors for auth tokens.
 */

const API_URL = "http://127.0.0.1:8000"; 

export const fetchData = async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    // Unique log to verify fresh code: [Update: Final Check]
    console.log(`[API CLIENT] Fetching: ${url}`);
    try {
        const response = await fetch(url, {
            cache: 'no-store', // Force no cache
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`[API ERROR] Failed at: ${url}`, error);
        throw error;
    }
};
