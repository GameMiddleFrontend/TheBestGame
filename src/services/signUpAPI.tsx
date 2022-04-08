const baseUrl = 'https://ya-praktikum.tech/api/v2';

type SignUpError = {
  reason: string;
};

class SignUpAPI {
  static async signUp(body: string): Promise<string> {
    const response = await fetch(baseUrl + '/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
      keepalive: true,
    });
    let result: SignUpError | string;
    if (!response.ok) {
      result = await response.json();
      throw new Error((result as SignUpError).reason);
    }
    return response.text();
  }
}

export default SignUpAPI;
