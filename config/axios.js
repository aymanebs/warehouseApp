import axios from "axios";

const apiClient = axios.create({

    baseURL: 'http://192.168.3.254:3000',
    timeout: 1000,

})

export default apiClient;