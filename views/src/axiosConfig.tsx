import axios from 'axios'

const axiosBase = axios.create({
    baseURL: 'http://localhost:5050/v1'
});

export default axiosBase