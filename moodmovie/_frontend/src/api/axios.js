import axios from 'axios';

// Scrutiny: removed the hardcoded fallback. 
// Vite will now inject the correct URL at build time.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Crucial for session-based feedback
    headers: {
        'Content-Type': 'application/json',
    }
});

// Optional Safety Check: Logs the URL in dev mode for verification
if (import.meta.env.DEV) {
    console.log("Current API URL:", import.meta.env.VITE_API_URL);
}

export default api;