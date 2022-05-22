import ServiceUtils from '@services/service.utils';
import IsServer from '@utils/isServer';

type YandexServiceIdResponse = {
  service_id?: string;
  reason?: string;
};

class YandexOAuthAPI {
  private static redirectUri = 'http://localhost:3000';

  public static async authWithYandex() {
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
