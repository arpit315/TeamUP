import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: `${API}/api/v1`,
    withCredentials: true,
});
export default api;
