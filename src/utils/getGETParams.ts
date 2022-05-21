import IsServer from '@utils/isServer';

const getGETParams = (): Record<string, any> | undefined => {
  if (IsServer) {
    return;
  }
  return window.location.search
    .replace('?', '')
    .split('&')
    .reduce(function (result: Record<string, any>, current: string) {
      const a = current.split('=');
      if (a[0]) {
        result[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
      }
      return result;
    }, {});
};

export default getGETParams;
