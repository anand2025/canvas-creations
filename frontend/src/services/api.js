/**
 * API Service
 * This file handles all HTTP requests to the backend API.
 * It typically includes a styled Axios instance or fetch wrappers with interceptors for auth tokens.
 */

const API_URL = "http://localhost:8000"; // Adjust based on backend URL

export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
