import React, {FC, useCallback} from 'react';
import FormComponent from '../../../common/form';
import {settingsPasswordsFormElementsDef} from '../settings.types';
import {UpdateUserInfoType, UserPasswordApiItem} from '../../../../models/user.model';
import {connect, MapDispatchToPropsParam} from 'react-redux';
import {Actions as userActions} from '../../../../redux/reducers/user/user.ducks';

interface IProps {
  isEditPasswordMode: boolean;
}

interface IDispatchHandlers {
  updatePassword(data: UpdateUserInfoType<UserPasswordApiItem>): void;
}

interface IHandlers extends IDispatchHandlers {
  onSavePassword(): void;
}

const mapDispatchToProps: MapDispatchToPropsParam<IDispatchHandlers, unknown> = {
  updatePassword: userActions.updatePassword,
};

const SettingsPasswordFormComponent: FC<IProps & IHandlers> = (props: IProps & IHandlers) => {
  const handleSavePassword = useCallback((data: UserPasswordApiItem) => {
    props.updatePassword({
      data,
      callback: () => {
        props.onSavePassword();
      },
    });
  }, []);

  return (
    <FormComponent
      formElementsDef={settingsPasswordsFormElementsDef}
      isEditMode={props.isEditPasswordMode}
      submitText={'Сохранить пароль'}
      onSubmit={handleSavePassword}
    />
  );
};

export default connect(null, mapDispatchToProps)(SettingsPasswordFormComponent);
