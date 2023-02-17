import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { localStorage } from '@/utils/storage';
import useStore from '@/store';
import { SearchModel } from '@/types/store';
import { Http } from '@/types/axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 6000
});
let showSuccess: any = null;

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    const { user } = useStore();
    let requestParams: any = {};
    switch (config.method) {
      case 'post':
        requestParams = config.data;
        break;
      default:
        requestParams = config.params;
        break;
    }

    const { $storeKey, gameid, sortType, username, date, keyWord, isFormData, sumType, chid } =
      requestParams;
    if (user.session && !isFormData) {
      requestParams.session = user.session;
    }
    if ($storeKey) {
      const { searchModel } = useStore();
      $storeKey.forEach((e: keyof SearchModel) => {
        if (e === 'time') {
          const startTime = searchModel.time![0];
          const endTime = searchModel.time![1];
          requestParams.startTime = startTime;
          requestParams.endTime = endTime;
          return;
        }
        if (!username || !keyWord || !date || !sortType || !sumType || !gameid || !chid) {
          requestParams[e] = searchModel[e];
        }
      });
      delete requestParams.$storeKey;
    }
    showSuccess = requestParams.showSuccess;
    showSuccess && delete requestParams.showSuccess;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { error, msg } = response.data;
    if (!error) {
      showSuccess &&
        ElMessage({
          message: '操作成功',
          type: 'success'
        });
      return [response.data, null];
    }

    if (error === 4001) {
      // token 过期
      localStorage.clear(); // 清除浏览器全部缓存
      window.location.href = '/login?redirect=/';
      return [null, null];
    }

    ElMessage({
      message: msg || '系统出错',
      type: 'error'
    });
    return [null, response.data];
  },
  err => {
    ElMessage({
      message: err || '系统出错',
      type: 'error'
    });
    return [null, Promise.reject(new Error(err || 'Error'))];
  }
);

const http: Http<any> = {
  get(url, params) {
    return service.get(url, { params });
  },
  post(url, params) {
    return service.post(url, params);
  }
};

// 导出 axios 实例
export default http;
