import axios from "axios"
const instance = axios.create({
    baseURL: 'https://fd-clone-backend.vercel.app/api'
});

export default instance