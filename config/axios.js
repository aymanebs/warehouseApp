import axios from "axios";

const apiClient = axios.create({

    baseURL: 'http://172.16.8.207:3000',
    timeout: 1000,

})

export default apiClient;