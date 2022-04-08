const baseUrl = 'https://ya-praktikum.tech/api/v2';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: string): Promise<string> {
    const response = await fetch(baseUrl + '/auth/signin', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      keepalive: true,
    });
    if (response.ok) {
      return response.text();
    }
    const result: LoginErrorRespone = await response.json();
    throw new Error(result?.reason || 'Ошибка входа');
  }
}

export default LoginAPI;
