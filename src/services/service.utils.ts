import {CallMethodType} from './enum/call-method-type.enum';

/** deprecated */
interface fetchConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  credentials?: 'include' | 'same-origin' | 'omit';
  keepalive?: true | false;
  headers?: Record<string, string>;
  body?: any;
}

class ServiceUtils {
  baseURL = 'https://ya-praktikum.tech/api/v2';

  simpleJsonHeader = {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Security-Policy': `default-src 'self'; img-src *; media-src https://ya-praktikum.tech`,
  };

  get(url: string, data?: unknown, requestInit?: RequestInit) {
    return this.serviceFetch(url, CallMethodType.GET, data, requestInit);
  }

  post(url: string, data?: unknown, requestInit?: RequestInit) {
    return this.serviceFetch(url, CallMethodType.POST, data, requestInit);
  }

  put(url: string, data?: unknown, requestInit?: RequestInit) {
    return this.serviceFetch(url, CallMethodType.PUT, data, requestInit);
  }

  async serviceFetch(url: string, type = CallMethodType.GET, data?: unknown, requestInit?: RequestInit) {
    const params: RequestInit = this.getFetchParams(type, requestInit, data);

    if (type === CallMethodType.GET && data) {
      url += '?' + queryString(data as Record<string, any>);
    }

    try {
      const response = await fetch(this.baseURL.concat(url), params).catch((e) => {
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
        params.headers = requestInit?.headers ?? this.simpleJsonHeader;
      }
    }
    return params;
  }

  async handleResponse(response: Response, data?: any) {
    try {
      if (response && response.status === 200) {
        return Promise.resolve((await response.json()) ?? this.tryParseJSON(response.response));
      }
      return this.handleError(response);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async handleError(error) {
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

    return false;
  }

  /** deprecated */
  getFetch(config: fetchConfig, endOfURL?: string) {
    return fetch(this.baseURL + endOfURL, config);
  }

  /** deprecated */
  POST(path: string, body?: any, headers?: Record<string, any>): Promise<any> {
    return fetch(this.baseURL + path, {
      method: 'POST',
      headers: headers || this.simpleJsonHeader,
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'include',
    });
  }

  /** deprecated */
  GET(path: string): Promise<any> {
    return fetch(this.baseURL + path, {
      method: 'GET',
      credentials: 'include',
    });
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
