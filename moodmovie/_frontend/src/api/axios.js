import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://mood-movie.netlify.app/',
    withCredentials: true // Crucial for session-based feedback
});

export default api;