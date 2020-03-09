import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: 'http://192.168.8.147:8081',
  timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.defaults.headers.post['Content-Type'] = 'application/json';
_axios.defaults.headers.put['Content-Type'] = 'application/json';

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (config.method === 'post' || config.method === 'put') {
      config.data = JSON.stringify(config.data);
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (response.status === 200) {
      return response.data;
    } else {
      return {
        code: -1,
        msg: 'network error',
        uiMsg: '网络错误',
        data: {}
      }
    }
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default function () {
  return _axios
}
