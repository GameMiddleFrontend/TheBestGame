import React, {useCallback, useState} from 'react';
import {compose} from 'redux';

import SettingsUserFormComponent from './settings-forms/settings-user-form.component';
import SettingsPasswordFormComponent from './settings-forms/settings-password-form.component';
import withAuth from '@hooks/chechAuthHookHOC';

import './settings.scss';

const SettingsPage = () => {
  const [isEditPasswordMode, setEditPasswordMode] = useState(false);

  const handleClickEditPasswordButton = useCallback(() => {
    setEditPasswordMode(true);
  }, []);

  const handleSavePassword = useCallback(() => {
    setEditPasswordMode(false);
  }, []);

  return (
    <div className={'page-container settings-page'}>
      <div className={'page-content'}>
        <div className={'form-container'}>
          {isEditPasswordMode ? (
            <SettingsPasswordFormComponent
              isEditPasswordMode={isEditPasswordMode}
              onSavePassword={handleSavePassword}
            />
          ) : (
            <SettingsUserFormComponent onClickEditPasswordButton={handleClickEditPasswordButton} />
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsPageHOC = compose(withAuth(SettingsPage));

export default SettingsPageHOC;
