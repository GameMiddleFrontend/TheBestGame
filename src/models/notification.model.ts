export interface INotification {
  message: string;
  title: string;
  type: INotificationType;
}

export enum INotificationType {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  ERROR = 'ERROR',
  EMPTY = '',
}

export enum INotificationTitles {
  SUCCESS = 'Выполнено успешно',
  INFO = 'Информация',
  ERROR = 'Ошибка',
  EMPTY = '',
}
