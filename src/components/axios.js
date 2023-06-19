import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:8800/api',
    // baseURL: 'http://192.168.210.121:8800/api',
  });

  export default instance