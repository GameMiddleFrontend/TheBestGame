export enum CallMethodType {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum HttpStatuses {
  SUCCESS = 200,
  EXTERNAL = 400,
  UNAUTHORIZED = 401,
  INTERNAL = 500,
}

export const defaultHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'content-security-policy': `default-src 'self'; img-src *; media-src https://ya-praktikum.tech`,
};
