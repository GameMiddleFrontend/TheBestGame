import React, {useState} from 'react';
import {settingsFormElementsDef, settingsPasswordsFormElementsDef} from './types';
import AvatarComponent from '../../common/avatar';
import FormComponent from '../../common/form';

import './settings-page.scss';

function SettingsPage() {
  const [isEditMode, setEditMode] = useState(false);
  const [isEditPasswordMode, setEditPasswordMode] = useState(false);

  const handleClickEditUserInfoButton = () => {
    setEditMode(true);
  };
  const handleClickEditPasswordButton = () => {
    setEditPasswordMode(true);
  };

  const handleSaveUserInfo = () => {
    setEditMode(false);
    //TODO
  };
  const handleSavePassword = () => {
    setEditPasswordMode(false);
    //TODO
  };

  const FormUser = () => {
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
            <button onClick={handleClickEditPasswordButton}>{'Изменить пароль'}</button>
          </div>
        )}
      </>
    );
  };

  const FormPassword = () => {
    return (
      <>
        <FormComponent
          formElementsDef={settingsPasswordsFormElementsDef}
          isEditMode={isEditPasswordMode}
          submitText={'Сохранить пароль'}
          onSubmit={handleSavePassword}
        />
      </>
    );
  };

  return (
    <div className={'page'}>
      <div className={'form-container'}>{isEditPasswordMode ? <FormPassword /> : <FormUser />}</div>
    </div>
  );
}

export default SettingsPage;
