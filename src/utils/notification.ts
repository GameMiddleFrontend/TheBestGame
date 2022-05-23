import {INotificationTitles, INotificationType} from '@models/notification.model';
import TextEnum from '../models/enum/text.enum';

export const getNotificationTitleByType = (type: INotificationType) => {
  switch (type) {
    case INotificationType.SUCCESS: {
      return INotificationTitles.SUCCESS;
    }
    case INotificationType.INFO: {
      return INotificationTitles.INFO;
    }
    case INotificationType.ERROR: {
      return INotificationTitles.ERROR;
    }
    default: {
      return INotificationTitles.ERROR;
    }
  }
};

const DEFAULT_EXCEPTION = {
  message: TextEnum.ERROR_MSG,
  title: getNotificationTitleByType(INotificationType.ERROR),
  type: INotificationType.ERROR,
};

export const getExceptionByError = (error?: Error) => {
  const {message} = error ?? {message: ''};

  return message
    ? {
        ...DEFAULT_EXCEPTION,
        message: message,
      }
    : DEFAULT_EXCEPTION;
};
