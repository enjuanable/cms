import axios from 'axios';
import { API_PREFIX } from "@/config/api";

// 创建axios实例
const instance = axios.create({
    // api统一由@/config/api存放
    baseURL: API_PREFIX,
    // baseURL: '/v1/',
    timeout: 5000,
});


instance.interceptors.request
    .use(function (config) {
        // 获取用户本地、添加授权的 token
        // 在Login.vue登录了就会产生token
        config.headers.Authorization = localStorage.getItem('token')?localStorage.getItem('token'):'';

        // 返回api接口
        return config;

        // 如果没有
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response.data;

}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;
