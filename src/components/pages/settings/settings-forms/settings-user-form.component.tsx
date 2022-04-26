import React, {FC, useCallback, useState} from 'react';
import {connect, MapDispatchToPropsParam} from 'react-redux';
import AvatarComponent from '../../../common/avatar';
import FormComponent from '../../../common/form';
import {settingsEditFormElementsDef, settingsFormElementsDef} from '../settings.types';
import IConfiguredStore from '../../../../redux/reducers/configured-store';
import {Actions as authActions, initialState as authInitialState} from '../../../../redux/reducers/auth/auth.ducks';
import {Actions as userActions} from '../../../../redux/reducers/user/user.ducks';
import {CurrentUserItem, UpdateUserInfoType} from '../../../../models/user.model';
import {Nullable} from '../../../../redux/redux.base.types';
import Button from '../../../common/button';

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

  const handleClickLogoutButton = useCallback(() => {
    props.logout();
  }, []);

  return (
    <>
      <AvatarComponent isEditMode={true} onChangeAvatar={handleSaveAvatar} imgSrc={props.user?.avatar} />
      <FormComponent
        formElementsDef={isEditMode ? settingsEditFormElementsDef : settingsFormElementsDef}
        values={props.user as CurrentUserItem}
        isEditMode={isEditMode}
        submitText={'Сохранить данные'}
        onSubmit={handleSaveUserInfo}
      />
      {!isEditMode && (
        <div className={'form-items-container'}>
          <Button className={'button-text'} onClick={handleClickEditUserInfoButton}>
            {'Изменить данные'}
          </Button>
          {props.onClickEditPasswordButton && (
            <Button className={'button-text'} onClick={props.onClickEditPasswordButton}>
              {'Изменить пароль'}
            </Button>
          )}
          <Button className={'button-text'} onClick={handleClickLogoutButton}>
            {'Выход'}
          </Button>
        </div>
      )}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsUserFormComponent);
