const baseUrl = 'https://ya-praktikum.tech/api/v2';

type authError = {
  reason: string;
};

type authSuccess = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
};

class AuthAPI {
  static async auth(): Promise<authSuccess> {
    const response = await fetch(baseUrl + '/auth/user', {
      method: 'GET',
      credentials: 'include',
      keepalive: true,
    });
    const result: authError | authSuccess = await response.json();
    if (!response.ok) {
      throw new Error((result as authError).reason || 'Ошибка аутентификации');
    }
    return result as authSuccess;
  }
}

export default AuthAPI;
