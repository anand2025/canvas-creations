/**
 * API Service
 * This file handles all HTTP requests to the backend API.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const getTokens = () => {
    if (typeof window === 'undefined') return null;
    return {
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
    };
};

const setTokens = (access, refresh, role) => {
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (role) localStorage.setItem('user_role', role);
};

export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
};

export const apiRequest = async (endpoint, options = {}) => {
    const tokens = getTokens();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (tokens?.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
    }

    const url = `${API_URL}${endpoint}`;
    
    try {
        let response = await fetch(url, { ...options, headers });

        if (response.status === 401 && tokens?.refresh) {
            // Attempt to refresh
            const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: tokens.refresh }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                setTokens(data.access_token);
                
                // Retry original request with new token
                headers['Authorization'] = `Bearer ${data.access_token}`;
                response = await fetch(url, { ...options, headers });
            } else {
                clearTokens();
                if (typeof window !== 'undefined') window.location.href = '/login';
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[API ERROR]`, error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2PasswordRequestForm expects 'username'
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Login failed");
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token, data.user?.role);
    
    return data;
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Registration failed");
    }

    return await response.json();
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const tokens = getTokens();
    const headers = {};
    if (tokens?.access) {
        headers['Authorization'] = `Bearer ${tokens.access}`;
    }

    const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: headers, // Do NOT set Content-Type for FormData, browser sets it with boundary
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    return await response.json();
};
