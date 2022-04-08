const baseUrl = 'https://ya-praktikum.tech/api/v2';

class SignUpAPI {
  static signUp(body: string): Promise<string> {
    return fetch(baseUrl + '/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      keepalive: true,
    }).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.status !== 200) {
          reject(response.json());
        } else {
          resolve(response.text());
        }
      });
    });
  }
}

export default SignUpAPI;
