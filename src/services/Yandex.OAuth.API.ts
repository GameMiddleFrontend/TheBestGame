import ServiceUtils from '@services/service.utils';
import IsServer from '@utils/isServer';

type YandexServiceIdResponse = {
  service_id?: string;
  reason?: string;
};

class YandexOAuthAPI {
  private static redirectUri = '';

  public static async authWithYandex() {
    YandexOAuthAPI.redirectUri = 'http://localhost:5000';
    return await YandexOAuthAPI.getServiceId(YandexOAuthAPI.redirectUri)
      .then((serviceId) => {
        YandexOAuthAPI.redirectYandexId(serviceId);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }

  private static async getServiceId(redirectUri: string) {
    return await ServiceUtils.get('/oauth/yandex/service-id', {redirect_uri: redirectUri}).then(
      (res: YandexServiceIdResponse) => {
        if (res.reason) {
          throw new Error(res.reason);
        }
        return res.service_id;
      },
    );
  }

  private static redirectYandexId(serviceId?: string) {
    if (!IsServer && serviceId) {
      const encodedServiceUri = encodeURIComponent(YandexOAuthAPI.redirectUri);
      const redirectYaUri = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${serviceId}&redirect_uri=${encodedServiceUri}`;
      window.location.href = redirectYaUri;
    }
  }

  public static async getUserByYandexCode(code: string) {
    YandexOAuthAPI.redirectUri = 'http://localhost:5000';
    return await ServiceUtils.post('/oauth/yandex', {code, redirect_uri: YandexOAuthAPI.redirectUri}).then(
      (response: YandexServiceIdResponse) => {
        if (response.reason) {
          throw new Error(response.reason);
        }
        return Promise.resolve();
      },
    );
  }
}

export default YandexOAuthAPI;
