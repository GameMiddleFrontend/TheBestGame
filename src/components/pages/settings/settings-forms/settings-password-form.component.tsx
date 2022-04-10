import React, {FC, useCallback} from 'react';
import FormComponent from '../../../common/form';
import {settingsPasswordsFormElementsDef} from '../settings.types';

interface IProps {
  isEditPasswordMode: boolean;
}

interface IHandlers {
  onSavePassword(): void;
}

const SettingsPasswordFormComponent: FC<IProps & IHandlers> = (props: IProps & IHandlers) => {
  const handleSavePassword = useCallback(() => {
    //TODO
    props.onSavePassword();
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

export default SettingsPasswordFormComponent;
