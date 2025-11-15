import axios from 'axios';
import { ElMessage } from 'element-plus';
import { params } from '@/store/store'; // 假设 store 中包含 token 和登录状态
import router from '@/router/index'; // 假设您的项目使用了 Vue Router

const service = axios.create({
    baseURL: '/api', // 所有请求的基础URL
    timeout: 60000 // 请求超时时间：60 秒
});


service.interceptors.request.use(
    config => {
        if (params.token) {
            config.headers.Authorization = "Bearer " + params.token;
        }
        if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
service.interceptors.response.use(
    response => {
        // 优化 1: 仅处理 2xx 状态码
        if (response.status >= 200 && response.status < 300) {
            // 假设后端返回的数据结构是 { code, message, data: actual_data }
            // 返回数据体的 data 字段
            if (response.data && response.data.data !== undefined) {
                 return response.data.data;
            }
            // 如果后端返回了 200 状态码，但响应体中没有 'data' 字段，则返回整个数据体
            return response.data;
        }
        // 如果状态码不是 2xx，理论上会被下面的 error 拦截器捕获，但保留此行作为防御
        return response; 
    },
    error => {
        // 错误处理 (HTTP 状态码非 2xx)
        const { response } = error;
        
        if (response) {
            const status = response.status;
            // 尝试从响应体中获取后端返回的自定义错误信息
            const serverMsg = response.data?.message || response.data?.error_message || '未知错误';
            let message = serverMsg;

            // 集中处理特定的 HTTP 状态码
            if (status === 401) {
                // 401 Unauthorized: 身份验证失败/Token过期
                message = "登录状态已失效或未授权，请重新登录！";
                ElMessage.error(message);
                
                // 【优化 2】强制跳转到登录页，清除过期的 Token
                params.token = ''; // 清除 store 中的 token
                localStorage.removeItem('token'); // 清除本地存储
                
                // 避免在登录页再次触发跳转
                if (router.currentRoute.name !== 'login') {
                    router.push('/login'); 
                }
                
            } else if (status === 403) {
                // 403 Forbidden: 权限不足
                message = "权限不足，无法访问该资源！";
                ElMessage.error(message);
                
            } else if (status >= 500) {
                // 5xx Server Error: 服务器内部错误
                message = `服务器内部错误 (${status})，请稍后重试。`;
                ElMessage.error(message);
                
            } else if (status >= 400) {
                // 其他 4xx 错误 (如 404 Not Found, 400 Bad Request)
                message = `请求错误 (${status})：${serverMsg}`;
                ElMessage.error(message);
            }
        } else {
            // 网络错误或请求被取消
            ElMessage.error("网络连接失败，请检查您的网络。");
        }
        
        // 将错误继续向下抛出，以便调用者可以捕获，防止 Uncaught 错误
        return Promise.reject(error);
    }
);

export default service;