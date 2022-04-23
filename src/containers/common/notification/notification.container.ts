import {connect} from 'react-redux';
import {Actions as notificationActions, initialState} from '../../../redux/reducers/notification/notification.duck';
import IConfiguredStore from '../../../redux/reducers/configured-store';
import PopupComponent from '../../../components/common/popup';
import {IPopupProps} from '../../../components/common/popup/types';

export const NotificationContainer = connect(
  (state: IConfiguredStore): IPopupProps => {
    const {message} = state && state.notification ? state.notification : initialState;
    return {message};
  },
  {
    setNotification: notificationActions.setNotification,
  },
)(PopupComponent);
