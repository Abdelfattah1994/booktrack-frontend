import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const authData = localStorage.getItem('booktrack.auth');
    if (authData) {
        const { token } = JSON.parse(authData);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;