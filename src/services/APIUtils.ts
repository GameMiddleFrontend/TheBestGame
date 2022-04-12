interface fetchConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  credentials?: 'include' | 'same-origin' | 'omit';
  keepalive?: true | false;
  headers?: Record<string, string>;
  body?: any;
}

class APIUtils {
  baseURL = 'https://ya-praktikum.tech/api/v2';

  simpleJsonHeader = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  getFetch(config: fetchConfig, endOfURL?: string) {
    return fetch(this.baseURL + endOfURL, config);
  }

  POST(path: string, body?: any, headers?: Record<string, any>): Promise<any> {
    return fetch(this.baseURL + path, {
      method: 'POST',
      headers: headers || this.simpleJsonHeader,
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'include',
    });
  }

  GET(path: string): Promise<any> {
    return fetch(this.baseURL + path, {
      method: 'GET',
      credentials: 'include',
    });
  }
}

export default new APIUtils();
