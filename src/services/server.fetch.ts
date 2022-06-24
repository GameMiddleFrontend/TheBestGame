import axios, {AxiosRequestConfig} from 'axios';

class AxiosUtils {
  get(url: string, data?: unknown, requestInit?: AxiosRequestConfig) {
    return axios
      .request({...requestInit, url: url, method: 'get'})
      .then((response) => response)
      .catch((error) => error);
  }

  post(url: string, data?: unknown, requestInit?: AxiosRequestConfig) {
    axios
      .post(url, data, requestInit)
      .then((response) => response)
      .catch((error) => error);
  }
}

export default new AxiosUtils();
