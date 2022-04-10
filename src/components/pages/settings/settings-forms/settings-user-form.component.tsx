import React, {FC, useCallback, useState} from 'react';
import AvatarComponent from '../../../common/avatar';
import FormComponent from '../../../common/form';
import {settingsFormElementsDef} from '../types';

interface IHandlers {
  onClickEditPasswordButton?(): void;
}

const SettingsUserFormComponent: FC<IHandlers> = (props: IHandlers) => {
  const [isEditMode, setEditMode] = useState(false);

  const handleSaveUserInfo = useCallback(() => {
    setEditMode(false);
    //TODO
  }, []);

  const handleClickEditUserInfoButton = () => {
    setEditMode(true);
  };

  return (
    <>
      <AvatarComponent isEditMode={true} />
      <FormComponent
        formElementsDef={settingsFormElementsDef}
        isEditMode={isEditMode}
        submitText={'Сохранить данные'}
        onSubmit={handleSaveUserInfo}
      />
      {!isEditMode && (
        <div className={'form-items-container'}>
          <button onClick={handleClickEditUserInfoButton}>{'Изменить данные'}</button>
          {props.onClickEditPasswordButton && (
            <button onClick={props.onClickEditPasswordButton}>{'Изменить пароль'}</button>
          )}
        </div>
      )}
    </>
  );
};

export default SettingsUserFormComponent;
