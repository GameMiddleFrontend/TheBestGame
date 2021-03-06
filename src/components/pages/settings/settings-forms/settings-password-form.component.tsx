import React, {FC, useCallback} from 'react';
import FormComponent from '@common/form';
import {settingsPasswordsFormElementsDef} from '../settings.types';
import {UpdateUserInfoType, UserPasswordApiItem} from '@models/user.model';
import {connect, MapDispatchToPropsParam} from 'react-redux';
import {Actions as userActions} from '@store/reducers/user/user.ducks';
import Button from '@common/button';
import TextEnum from '@models/enum/text.enum';

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
    <>
      <FormComponent
        formElementsDef={settingsPasswordsFormElementsDef}
        isEditMode={props.isEditPasswordMode}
        submitText={TextEnum.BUTTON_SAVE}
        onSubmit={handleSavePassword}
      />
      <Button className={'button-text'} onClick={props.onSavePassword}>
        {TextEnum.BUTTON_CANCEL}
      </Button>
    </>
  );
};

export default connect(null, mapDispatchToProps)(SettingsPasswordFormComponent);
