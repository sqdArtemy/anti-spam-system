import axios from 'axios';
import {snakeToCamel, camelToSnake, getErrorMessage} from './utils.ts';
import {authService} from "./services/authService.ts";

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

axiosInstance.interceptors.request.use(
    function (config) {
        config.data = camelToSnake(config.data);
        config.headers['Content-Type'] = 'multipart/form-data';

        const token = localStorage.getItem('accessToken'); //getTokenFromSomewhere();
        if (
            token &&
            config.url !== '/user/login' &&
            config.url !== '/user/register' &&
            config.url !== '/token/refresh'
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        response.data = snakeToCamel(response.data);
        return response;
    },
    async function (error) {
        if (
            error.response?.status === 401 &&
            !error.config?.url?.includes('/token/refresh') &&
            !error.config?.url?.includes('/user/logout') &&
            !error.config?.url?.includes('/user/login') &&
            !error.config?.url?.includes('/user/register') &&
            !error.config?.url?.includes('/me')
        ) {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await authService.refreshToken(refreshToken!);
            if (response.data && response.data.accessToken) {
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                localStorage.setItem('accessToken', response.data.accessToken);
                return axiosInstance(originalRequest);
            }
        }

        console.log(error.response.data);
        error.response.data = getErrorMessage(error.response.data);
        return Promise.reject(error);
    }
);