const baseUrl = 'https://ya-praktikum.tech/api/v2';

type LoginErrorRespone = {
  reason?: string;
};

class LoginAPI {
  static async signIn(body: Record<string, any>): Promise<string> {
    const response = await fetch(baseUrl + '/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
