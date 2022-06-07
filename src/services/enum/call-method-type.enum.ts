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
