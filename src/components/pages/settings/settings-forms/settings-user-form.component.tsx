import React, {FC, useCallback, useState} from 'react';
import {connect, MapDispatchToPropsParam} from 'react-redux';
import AvatarComponent from '@common/avatar';
import FormComponent from '@common/form';
import {settingsEditFormElementsDef, settingsFormElementsDef} from '../settings.types';
import IConfiguredStore from '@store/reducers/configured-store';
import {Actions as authActions, initialState as authInitialState} from '@store/reducers/auth/auth.ducks';
import {Actions as userActions} from '@store/reducers/user/user.ducks';
import {CurrentUserItem, UpdateUserInfoType} from '@models/user.model';
import {Nullable} from '@store/redux.base.types';
import Button from '@common/button';
import TextEnum from '@models/enum/text.enum';
import {useNavigate} from 'react-router-dom';
import AppRoutes from '@utils/app-routes';

interface IProps {
  isLoading: boolean;
  user?: Nullable<CurrentUserItem>;
}

interface IDispatchHandlers {
  logout(): void;
  updateInfo(data: UpdateUserInfoType<CurrentUserItem>): void;
  updateAvatar(file: File): void;
}

interface IHandlers extends IDispatchHandlers {
  onClickEditPasswordButton?(): void;
}

const mapStateToProps = (state: IConfiguredStore): IProps => {
  //TODO add Reselect
  const {isLoading} = state && state.auth ? state.auth : authInitialState;
  const user = state && state.user ? state.user.item : null;
  return {
    isLoading,
    user,
  };
};

const mapDispatchToProps: MapDispatchToPropsParam<IDispatchHandlers, unknown> = {
  logout: authActions.logout,
  updateInfo: userActions.updateInfo,
  updateAvatar: userActions.updateAvatar,
};

const SettingsUserFormComponent: FC<IProps & IHandlers> = (props) => {
  const navigate = useNavigate();
  const [isEditMode, setEditMode] = useState(false);

  const handleSaveUserInfo = useCallback((data: CurrentUserItem) => {
    props.updateInfo({
      data,
      callback: () => {
        setEditMode(false);
      },
    });
  }, []);

  const handleSaveAvatar = useCallback((file: File) => {
    props.updateAvatar(file);
  }, []);

  const handleClickEditUserInfoButton = () => {
    setEditMode(true);
  };

  const handleFinishEditUserInfoButton = () => {
    setEditMode(false);
  };

  const handleClickLogoutButton = useCallback(() => {
    props.logout();
    navigate(AppRoutes.HOME);
  }, []);

  return (
    <>
      <AvatarComponent isEditMode={true} onChangeAvatar={handleSaveAvatar} imgSrc={props.user?.avatar} />
      {!isEditMode && <h4 className={'user-display-name'}>{props.user?.display_name}</h4>}
      <FormComponent
        formElementsDef={isEditMode ? settingsEditFormElementsDef : settingsFormElementsDef}
        values={props.user as CurrentUserItem}
        isEditMode={isEditMode}
        submitText={TextEnum.BUTTON_SAVE}
        onSubmit={handleSaveUserInfo}
      />
      {isEditMode ? (
        <Button className={'button-text'} onClick={handleFinishEditUserInfoButton}>
          {TextEnum.BUTTON_CANCEL}
        </Button>
      ) : (
        <div className={'form-items-container'}>
          <Button className={'button-text'} onClick={handleClickEditUserInfoButton}>
            {TextEnum.BUTTON_CHANGE_DATA}
          </Button>
          {props.onClickEditPasswordButton && (
            <Button className={'button-text'} onClick={props.onClickEditPasswordButton}>
              {TextEnum.BUTTON_CHANGE_PASSWORD}
            </Button>
          )}
          <Button className={'button-text'} onClick={handleClickLogoutButton}>
            {TextEnum.BUTTON_EXIT}
          </Button>
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsUserFormComponent);
