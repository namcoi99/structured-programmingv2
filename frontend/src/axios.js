import axios from 'axios';
import config from './config';

export default axios.create({
    // Tạo url cơ sở khi gửi request cho backend
    baseURL: config.rootPath,
    withCredentials: true
});