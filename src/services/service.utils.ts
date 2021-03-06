import {CallMethodType, defaultHeaders} from './enum/call-method-type.enum';

class ServiceUtils {
  baseURL = 'https://ya-praktikum.tech/api/v2';

  get(url: string, data?: unknown, requestInit?: RequestInit) {
    return this.serviceFetch(url, CallMethodType.GET, data, requestInit);
  }

  post(url: string, data?: unknown, requestInit?: RequestInit, fullURL?: string) {
    return this.serviceFetch(url, CallMethodType.POST, data, requestInit, fullURL);
  }

  put(url: string, data?: unknown, requestInit?: RequestInit, fullURL?: string) {
    return this.serviceFetch(url, CallMethodType.PUT, data, requestInit, fullURL);
  }

  async serviceFetch(
    url: string,
    type = CallMethodType.GET,
    data?: unknown,
    requestInit?: RequestInit,
    fullURL?: string,
  ) {
    const params: RequestInit = this.getFetchParams(type, requestInit, data);

    if (type === CallMethodType.GET && data) {
      url += '?' + queryString(data as Record<string, any>);
    }

    try {
      const currentURL = fullURL || this.baseURL.concat(url);

      const response = await fetch(currentURL, params).catch((e) => {
        throw e;
      });
      return await this.handleResponse(response, data);
    } catch (e) {
      return await this.handleError(e);
    }
  }

  getFetchParams(type = CallMethodType.GET, requestInit?: RequestInit, data?: unknown): RequestInit {
    const {DELETE, GET, POST, PUT} = CallMethodType;

    const params: RequestInit = {
      ...requestInit,
      method: type,
      keepalive: requestInit?.keepalive ?? true,
      credentials: requestInit?.credentials ?? 'include',
    };

    if ([POST, PUT, DELETE].includes(type)) {
      if (data instanceof FormData) {
        params.body = data;
      } else if (data) {
        params.body = JSON.stringify(data);
        params.headers = requestInit?.headers ?? defaultHeaders;
      }
    }
    return params;
  }

  async handleResponse(response: Response, data?: any) {
    try {
      if (response && response.status === 200) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          return Promise.resolve(this.tryParseJSON((response as any).response) ?? (await response.json()));
        } else {
          return Promise.resolve(await response.text());
        }
      }
      return this.handleError(response);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async handleError(error: any) {
    if (error && error.response) {
      const err = JSON.parse(error.response);
      return Promise.reject(err?.reason || err);
    } else if (error instanceof Response) {
      const err = await error.json();
      throw new Error(err?.reason);
    }
    return Promise.reject(error);
  }

  tryParseJSON(jsonString: string) {
    try {
      const str = JSON.parse(jsonString);

      if (str && typeof str === 'object') {
        return str;
      }
    } catch (e) {}

    return;
  }
}

function queryString(data: Record<string, any>) {
  return getParams(data)
    .map((arr) => arr.join('='))
    .join('&');
}

function getParams(data: Record<string, any>): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(data)) {
    result.push([getKey(key), encodeURIComponent(String(value))]);
  }
  return result;
}

function getKey(key: string, parentKey?: string) {
  return parentKey ? `${parentKey}[${key}]` : key;
}

export default new ServiceUtils();
